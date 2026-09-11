"""Testes dos endpoints da API REST do Catálogo e Motor Acústico (Fase 4)."""
import os
import sys

from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from main import app

client = TestClient(app)


def test_api_listar_materiais():
    response = client.get("/materiais")
    assert response.status_code == 200
    dados = response.json()
    assert isinstance(dados, list)
    assert len(dados) >= 10
    nomes = [m["nome"] for m in dados]
    assert any("Bloco cerâmico" in n for n in nomes)
    assert any("Concreto" in n for n in nomes)


def test_api_obter_material_id():
    response = client.get("/materiais/1")
    assert response.status_code == 200
    mat = response.json()
    assert mat["id"] == 1
    assert "variacoes" in mat
    assert len(mat["variacoes"]) > 0


def test_api_listar_sistemas():
    response = client.get("/sistemas")
    assert response.status_code == 200
    sistemas = response.json()
    assert len(sistemas) >= 10

    # Filtro por tipo_elemento
    resp_paredes = client.get("/sistemas?tipo_elemento=parede")
    assert resp_paredes.status_code == 200
    paredes = resp_paredes.json()
    assert all(p["tipo_elemento"] == "parede" for p in paredes)
    assert len(paredes) == 6


def test_api_obter_sistema_codigo():
    response = client.get("/sistemas/PAR-CER-014")
    assert response.status_code == 200
    sis = response.json()
    assert sis["codigo"] == "PAR-CER-014"
    assert len(sis["camadas"]) == 3
    assert len(sis["dados_acusticos"]) >= 1
    assert sis["dados_acusticos"][0]["rw"] == 40.0
    assert "IPT" in sis["dados_acusticos"][0]["fonte"]


def test_api_montar_sistema():
    # Envia composição de 3 camadas correspondente a PAR-CER-014
    # Argamassa 1,5 cm + Bloco cerâmico 14 cm + Argamassa 1,5 cm
    mat_arg = client.get("/materiais").json()[2]["id"]  # Argamassa
    mat_cer = client.get("/materiais").json()[0]["id"]  # Bloco cerâmico

    payload = {
        "camadas": [
            {"material_id": mat_arg, "espessura": 0.015},
            {"material_id": mat_cer, "espessura": 0.14},
            {"material_id": mat_arg, "espessura": 0.015}
        ]
    }
    response = client.post("/sistemas/montar", json=payload)
    assert response.status_code == 200
    dados = response.json()
    assert dados["espessura_total_cm"] == 17.0
    assert dados["massa_completa"] is True
    assert dados["massa_superficial_total"] is not None
    assert dados["status"] == "correspondencia_exata_encontrada"
    assert dados["sistema_correspondente"]["codigo"] == "PAR-CER-014"
    assert dados["dados_acusticos"][0]["rw"] == 40.0


def test_api_cenarios():
    response = client.get("/acustica/cenarios")
    assert response.status_code == 200
    cenarios = response.json()
    assert "aereo" in cenarios
    assert "impacto" in cenarios
    assert "parede_entre_unidades" in cenarios["aereo"]


def test_api_calcular_com_sistema_documentado():
    payload = {
        "tipo_analise": "aereo",
        "cenario": "parede_entre_unidades",
        "sistema_codigo": "PAR-CER-014",
        "area_elemento": 15.0,
        "volume_receptor": 45.0,
        "reverberacao": 0.6
    }
    response = client.post("/acustica/calcular", json=payload)
    assert response.status_code == 200
    dados = response.json()
    assert dados["tipo"] == "aereo"
    assert dados["indicador_principal"]["nome"] == "DnT,w"
    assert dados["indicador_principal"]["valor"] > 0
    assert "confiabilidade" in dados
    assert "fontes" in dados
    assert len(dados["fontes"]) > 0
    assert "status_atendimento" in dados
