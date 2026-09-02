"""Teste end-to-end dos handlers de /acustica chamados diretamente,
usando um banco SQLite em memoria (nao exige pacote 'httpx' nem toca no acoust.db)."""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)) + '/..')

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from database import Base
import models  # noqa: F401  registra as tabelas no Base.metadata

from acustica import calcular, salvar_simulacao, listar_simulacoes
from schemas import CalcularRequest, SimulacaoCreate

CASO = {
    "tipo_analise": "aereo",
    "area_elemento": 15.5,
    "volume_receptor": 30,
    "reverberacao": 0.6,
    "reverberacao_emissor": 0.6,
    "reducao_sonora": 52,
    "l1": 85,
}


def _nova_sessao():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    return sessionmaker(bind=engine)()


def _quase(a, b, tol=0.02):
    return abs(a - b) <= tol


def test_calcular_publico():
    data = calcular(CalcularRequest(**CASO))
    assert data["indicador_principal"]["nome"] == "L2", data["indicador_principal"]
    assert _quase(data["detalhes"]["l2_previsto"], 134.13), data
    assert data["classificacao"] in ("atende", "nao_atende", "indisponivel")
    assert "criterios" in data and data["criterios"]["norma"] == "NBR 15575"
    assert isinstance(data["sugestoes"], list)
    import json  # confere que a resposta e serializavel em JSON
    json.dumps(data)
    print("OK /calcular -> L2 =", data["indicador_principal"]["valor"], "dB |", data["classificacao"])


def test_calcular_invalido():
    from fastapi import HTTPException
    try:
        calcular(CalcularRequest(**{**CASO, "area_elemento": 0}))
        raise AssertionError("Deveria rejeitar area=0")
    except HTTPException as e:
        assert e.status_code == 422
        print("OK /calcular rejeita zero ->", e.status_code)


def test_fluxo_salvar_e_listar():
    db = _nova_sessao()
    from models import User
    user = User(id=10, name="Tester", email="teste_calc@email.com", password="x")

    nova = salvar_simulacao(
        SimulacaoCreate(tipo_analise="aereo", dados_entrada=CASO, resultado={"indicador_principal": {"valor": 49.92}}),
        db=db,
        user=user,
    )
    assert nova["id"] is not None

    rows = listar_simulacoes(db=db, user=user)
    assert len(rows) == 1
    assert rows[0]["id"] == nova["id"]
    assert rows[0]["dados_entrada"]["l1"] == 85  # dict deserializado do JSON
    db.close()
    print("OK fluxo salvar/listar -> ids:", [r["id"] for r in rows])


if __name__ == "__main__":
    test_calcular_publico()
    test_calcular_invalido()
    test_fluxo_salvar_e_listar()
    print("\nTODOS OS TESTES DO ROUTER PASSARAM = OK")