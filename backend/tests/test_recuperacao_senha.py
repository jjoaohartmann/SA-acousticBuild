"""Fluxo "esqueci minha senha": do pedido ao login com a senha nova.

Usa um banco SQLite em memória por teste, então não depende do seed nem toca
no acoust.db. A entrega do link é substituída por uma função que só guarda o
link — é a única forma de obtê-lo, porque a API nunca o devolve.
"""
import os
import sys
from datetime import timedelta

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import recuperacao  # type: ignore  # noqa: E402
from database import Base, get_db  # type: ignore  # noqa: E402
from main import app  # type: ignore  # noqa: E402
from models import TokenRedefinicaoSenha  # type: ignore  # noqa: E402

EMAIL = "pessoa@exemplo.com"
SENHA_ANTIGA = "senhaantiga"
SENHA_NOVA = "senhanova123"


@pytest.fixture
def ambiente(monkeypatch):
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    Base.metadata.create_all(bind=engine)
    Sessao = sessionmaker(bind=engine, autocommit=False, autoflush=False)

    def _get_db():
        db = Sessao()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = _get_db

    enviados: list[dict] = []
    monkeypatch.setattr(
        recuperacao, "enviar_link",
        lambda email, nome, link: enviados.append({"email": email, "link": link}),
    )

    client = TestClient(app)
    resp = client.post("/auth/register", json={
        "name": "Pessoa Teste", "email": EMAIL, "password": SENHA_ANTIGA,
    })
    assert resp.status_code == 201

    yield client, enviados, Sessao
    app.dependency_overrides.clear()


def _token(link: str) -> str:
    return link.split("token=", 1)[1]


def _login(client, senha):
    return client.post("/auth/login", json={"email": EMAIL, "password": senha})


def test_resposta_identica_para_email_cadastrado_e_inexistente(ambiente):
    client, enviados, _ = ambiente
    r_existe = client.post("/auth/esqueci-senha", json={"email": EMAIL})
    r_nao_existe = client.post("/auth/esqueci-senha", json={"email": "ninguem@exemplo.com"})

    assert r_existe.status_code == r_nao_existe.status_code == 200
    assert r_existe.json() == r_nao_existe.json()
    # só a conta que existe recebeu link
    assert [e["email"] for e in enviados] == [EMAIL]


def test_token_nunca_volta_na_resposta(ambiente):
    client, enviados, _ = ambiente
    resp = client.post("/auth/esqueci-senha", json={"email": EMAIL})
    token = _token(enviados[0]["link"])
    assert token not in resp.text


def test_banco_guarda_so_o_hash(ambiente):
    client, enviados, Sessao = ambiente
    client.post("/auth/esqueci-senha", json={"email": EMAIL})
    token = _token(enviados[0]["link"])

    with Sessao() as db:
        registros = db.query(TokenRedefinicaoSenha).all()
        assert len(registros) == 1
        assert registros[0].token_hash != token
        assert registros[0].token_hash == recuperacao._hash(token)


def test_redefinir_troca_a_senha(ambiente):
    client, enviados, _ = ambiente
    client.post("/auth/esqueci-senha", json={"email": EMAIL})
    token = _token(enviados[0]["link"])

    resp = client.post("/auth/redefinir-senha", json={"token": token, "nova_senha": SENHA_NOVA})
    assert resp.status_code == 200

    assert _login(client, SENHA_NOVA).status_code == 200
    assert _login(client, SENHA_ANTIGA).status_code == 401


def test_link_serve_uma_vez_so(ambiente):
    client, enviados, _ = ambiente
    client.post("/auth/esqueci-senha", json={"email": EMAIL})
    token = _token(enviados[0]["link"])

    assert client.post("/auth/redefinir-senha", json={"token": token, "nova_senha": SENHA_NOVA}).status_code == 200
    segunda = client.post("/auth/redefinir-senha", json={"token": token, "nova_senha": "outrasenha"})
    assert segunda.status_code == 400
    assert _login(client, SENHA_NOVA).status_code == 200


def test_link_expirado_e_recusado(ambiente):
    client, enviados, Sessao = ambiente
    client.post("/auth/esqueci-senha", json={"email": EMAIL})
    token = _token(enviados[0]["link"])

    with Sessao() as db:
        registro = db.query(TokenRedefinicaoSenha).one()
        registro.expira_em = registro.criado_em - timedelta(minutes=1)
        db.commit()

    resp = client.post("/auth/redefinir-senha", json={"token": token, "nova_senha": SENHA_NOVA})
    assert resp.status_code == 400
    assert _login(client, SENHA_ANTIGA).status_code == 200


def test_novo_pedido_invalida_o_link_anterior(ambiente):
    client, enviados, _ = ambiente
    client.post("/auth/esqueci-senha", json={"email": EMAIL})
    client.post("/auth/esqueci-senha", json={"email": EMAIL})
    antigo, novo = _token(enviados[0]["link"]), _token(enviados[1]["link"])

    assert client.post("/auth/redefinir-senha", json={"token": antigo, "nova_senha": SENHA_NOVA}).status_code == 400
    assert client.post("/auth/redefinir-senha", json={"token": novo, "nova_senha": SENHA_NOVA}).status_code == 200


def test_token_desconhecido_e_recusado(ambiente):
    client, _, _ = ambiente
    resp = client.post("/auth/redefinir-senha", json={
        "token": "x" * 43, "nova_senha": SENHA_NOVA,
    })
    assert resp.status_code == 400


def test_senha_nova_curta_e_recusada(ambiente):
    client, enviados, _ = ambiente
    client.post("/auth/esqueci-senha", json={"email": EMAIL})
    token = _token(enviados[0]["link"])

    resp = client.post("/auth/redefinir-senha", json={"token": token, "nova_senha": "123"})
    assert resp.status_code == 422
    # a tentativa inválida não queimou o link
    assert client.post("/auth/redefinir-senha", json={"token": token, "nova_senha": SENHA_NOVA}).status_code == 200


def test_limite_de_pedidos_por_janela(ambiente):
    client, enviados, _ = ambiente
    respostas = [client.post("/auth/esqueci-senha", json={"email": EMAIL}) for _ in range(5)]

    # a resposta não muda depois do limite — senão ela revelaria que a conta existe
    assert all(r.status_code == 200 for r in respostas)
    assert len({r.text for r in respostas}) == 1
    assert len(enviados) == recuperacao.MAX_PEDIDOS_POR_JANELA
