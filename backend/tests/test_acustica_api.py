"""Teste end-to-end dos handlers de /acustica chamados diretamente,
usando um banco SQLite em memoria (nao exige pacote 'httpx' nem toca no acoust.db)."""
import os
import sys

# Adiciona o diretorio backend ao sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import models  # type: ignore
from acustica import (  # type: ignore
    calcular,
    listar_simulacoes,
    salvar_simulacao,
)
from database import Base  # type: ignore
from schemas import CalcularRequest, SimulacaoCreate  # type: ignore
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

CASO = {
    "tipo_analise": "aereo",
    "area_elemento": 15.5,
    "volume_receptor": 30.0,
    "reverberacao": 0.6,
    "reducao_sonora": 52.0,
    "l1": 85.0,
}


def _nova_sessao():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    return sessionmaker(bind=engine)()


def _quase(a: float, b: float, tol: float = 0.03) -> bool:
    return abs(a - b) <= tol


def test_calcular_publico():
    data = calcular(CalcularRequest(**CASO))
    assert data["indicador_principal"]["nome"] == "DnT", data["indicador_principal"]
    assert _quase(float(data["indicador_principal"]["valor"]), 49.92), data["indicador_principal"]
    assert _quase(float(data["detalhes"]["l2_previsto"]), 35.87), data["detalhes"]
    assert data["classificacao"] in ("atende", "nao_atende", "indisponivel")
    assert "criterios" in data and data["criterios"]["norma"] == "NBR 15575"
    assert isinstance(data["sugestoes"], list)
    import json
    json.dumps(data)
    print("OK /calcular -> DnT =", data["indicador_principal"]["valor"], "dB |", data["classificacao"])


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
    user = models.User(id=10, name="Tester", email="teste_calc@email.com", password="x")

    nova = salvar_simulacao(
        SimulacaoCreate(tipo_analise="aereo", dados_entrada=CASO, resultado={"indicador_principal": {"valor": 49.92}}),
        db=db,
        user=user,
    )
    assert nova["id"] is not None

    rows = listar_simulacoes(db=db, user=user)
    assert len(rows) == 1
    assert rows[0]["id"] == nova["id"]
    assert rows[0]["dados_entrada"]["l1"] == 85
    db.close()
    print("OK fluxo salvar/listar -> ids:", [r["id"] for r in rows])


if __name__ == "__main__":
    test_calcular_publico()
    test_calcular_invalido()
    test_fluxo_salvar_e_listar()
    print("\nTODOS OS TESTES DO ROUTER PASSARAM = OK")