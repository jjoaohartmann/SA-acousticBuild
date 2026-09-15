"""Matriz de caminhos do POST /acustica/calcular.

A tela de resultados monta uma conta de três passos e dois cartões de
indicador a partir desta resposta. Cada teste aqui protege uma coisa que já
quebrou na tela:

- no piso, o cálculo por catálogo não devolvia o que a tela procurava e os
  passos 1 e 2 apareciam em branco;
- na parede, o L1 escolhido no passo 2 era ignorado e o resultado usava sempre
  85 dB;
- a narrativa dizia "o indicador principal obtido foi  = 0,00 dB";
- o Rw teórico da estimativa não chegava como indicador secundário.

Usa o banco populado pelo seed.py, como test_catalogo_api.py.
"""
import math
import os
import sys

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from criteria import CRITERIOS_CENARIOS  # type: ignore  # noqa: E402
from main import app  # type: ignore  # noqa: E402

client = TestClient(app)

GEOMETRIA = {"area_elemento": 15, "volume_receptor": 36, "reverberacao": 0.6}

DRYWALL_73 = [
    {"material_id": 5, "espessura": 0.0125},
    {"material_id": 6, "espessura": 0.05},
    {"material_id": 5, "espessura": 0.0125},
]
DRYWALL_LA_75 = [
    {"material_id": 5, "espessura": 0.0125},
    {"material_id": 6, "espessura": 0.075},
    {"material_id": 5, "espessura": 0.0125},
]
ALVENARIA_RIGIDA = [
    {"material_id": 3, "espessura": 0.02},
    {"material_id": 2, "espessura": 0.19},
    {"material_id": 3, "espessura": 0.02},
]
LAJE_FLUTUANTE = [
    {"material_id": 4, "espessura": 0.14},
    {"material_id": 7, "espessura": 0.005},
    {"material_id": 8, "espessura": 0.05},
]

AEREO_VALIDOS = {
    "catalogo": {"sistema_codigo": "PAR-CER-014"},
    "camadas_iguais_ao_catalogo": {"camadas": DRYWALL_73},
    "estimativa_lei_da_massa": {"camadas": ALVENARIA_RIGIDA},
    "r_informado": {"reducao_sonora": 52},
    "laje_como_parede": {"sistema_codigo": "LAJ-MAC-014"},
}

IMPACTO_VALIDOS = {
    "catalogo_flutuante": {"sistema_codigo": "LAJ-FLU-014"},
    "catalogo_macica": {"sistema_codigo": "LAJ-MAC-010"},
    "catalogo_vinilico": {"sistema_codigo": "LAJ-VIN-014"},
    "camadas_iguais_ao_catalogo": {"camadas": LAJE_FLUTUANTE},
    "medicao_li": {"nivel_impacto": 60, "li": 60},
}


def calcular(**campos):
    corpo = dict(GEOMETRIA)
    corpo.update(campos)
    return client.post("/acustica/calcular", json=corpo)


def _todos_os_validos():
    for nome, extra in AEREO_VALIDOS.items():
        yield f"aereo-{nome}", {"tipo_analise": "aereo", "cenario": "parede_entre_unidades", "l1": 85, **extra}
    yield "aereo-medicao", {"tipo_analise": "aereo", "cenario": "parede_entre_unidades", "l1": 85, "l2": 40}
    for nome, extra in IMPACTO_VALIDOS.items():
        yield f"impacto-{nome}", {"tipo_analise": "impacto", "cenario": "laje_entre_unidades", **extra}


VALIDOS = dict(_todos_os_validos())


# --- Parede ----------------------------------------------------------------

@pytest.mark.parametrize("caminho", AEREO_VALIDOS)
@pytest.mark.parametrize("l1", [60, 85, 95])
def test_aereo_usa_o_l1_escolhido_e_a_conta_fecha(caminho, l1):
    resp = calcular(tipo_analise="aereo", cenario="parede_entre_unidades", l1=l1, **AEREO_VALIDOS[caminho])
    assert resp.status_code == 200
    d = resp.json()
    det = d["detalhes"]

    assert det["l1"] == l1
    # L2 = L1 - DnT + 10*log10(T/T0)
    esperado = l1 - det["dnt"] + 10 * math.log10(det["t"] / 0.5)
    assert d["nivel_recebido"] == pytest.approx(esperado, abs=0.02)
    assert d["conforto"]["nivel_estimado"] == pytest.approx(d["nivel_recebido"], abs=0.05)


def test_trocar_o_l1_muda_o_que_chega_mas_nao_o_veredito():
    alto = calcular(tipo_analise="aereo", cenario="parede_entre_unidades", l1=85, sistema_codigo="PAR-CER-014").json()
    baixo = calcular(tipo_analise="aereo", cenario="parede_entre_unidades", l1=60, sistema_codigo="PAR-CER-014").json()

    assert alto["nivel_recebido"] - baixo["nivel_recebido"] == pytest.approx(25, abs=0.01)
    assert alto["indicador_principal"]["valor"] == baixo["indicador_principal"]["valor"]
    assert alto["classificacao"] == baixo["classificacao"]


def test_aereo_medicao_mantem_os_niveis_medidos():
    d = calcular(tipo_analise="aereo", cenario="parede_entre_unidades", l1=85, l2=40).json()
    assert d["detalhes"]["l1"] == 85
    assert d["nivel_recebido"] == 40


def test_estimativa_devolve_o_rw_teorico_como_secundario():
    d = calcular(tipo_analise="aereo", cenario="parede_entre_unidades", l1=85, camadas=ALVENARIA_RIGIDA).json()
    assert d["confiabilidade"] == "estimativa_teorica"
    assert d["indicador_secundario"]["nome"].startswith("Rw")
    assert d["indicador_secundario"]["valor"] == pytest.approx(d["detalhes"]["rw"], abs=0.01)


def test_l1_ausente_vira_85_e_fica_marcado_como_padrao():
    d = calcular(tipo_analise="aereo", cenario="parede_entre_unidades", sistema_codigo="PAR-CER-014").json()
    assert d["detalhes"]["l1"] == 85
    assert d["detalhes"]["l1_padrao"] is True


# --- Piso ------------------------------------------------------------------

@pytest.mark.parametrize("caminho", IMPACTO_VALIDOS)
def test_impacto_tem_ponto_de_partida_e_chegada_para_a_conta(caminho):
    resp = calcular(tipo_analise="impacto", cenario="laje_entre_unidades", **IMPACTO_VALIDOS[caminho])
    assert resp.status_code == 200
    d = resp.json()
    det = d["detalhes"]
    final = d["indicador_principal"]["valor"]

    # a tela parte do Li (medição) ou do Ln,w (laboratório); sem um dos dois, os passos ficam vazios
    base = det.get("li", det.get("ln_w"))
    assert isinstance(base, (int, float))
    assert d["nivel_recebido"] == pytest.approx(final)


def test_impacto_do_caso_reportado_fecha_a_conta():
    """Laje flutuante em sala de aula: 56 dB de laboratório vira 55,4 dB no cômodo."""
    d = calcular(
        tipo_analise="impacto", cenario="laje_escolar_educacional",
        ambiente_receptor_tipo="sala_aula", sistema_codigo="LAJ-FLU-014",
    ).json()
    assert d["detalhes"]["ln_w"] == 56
    assert d["indicador_principal"]["valor"] == pytest.approx(55.39, abs=0.01)
    # 55,39 > 55: não atende, mesmo que um arredondamento para inteiro sugira o contrário
    assert d["classificacao"] == "nao_atende"


def test_conforto_do_impacto_explica_que_e_maquina_de_impacto():
    d = calcular(tipo_analise="impacto", cenario="laje_entre_unidades", sistema_codigo="LAJ-FLU-014").json()
    assert "máquina de impacto" in d["conforto"]["observacao"]


# --- Coerência geral -------------------------------------------------------

@pytest.mark.parametrize("caso", VALIDOS)
def test_narrativa_cita_o_indicador_de_verdade(caso):
    d = calcular(**VALIDOS[caso]).json()
    narrativa = d.get("narrativa")
    if narrativa:
        assert d["indicador_principal"]["nome"] in narrativa
        assert " = 0,00" not in narrativa


@pytest.mark.parametrize(
    "tipo,cenario",
    [(t, c) for t in CRITERIOS_CENARIOS for c in CRITERIOS_CENARIOS[t]],
)
def test_veredito_coerente_com_o_limite_em_todo_cenario(tipo, cenario):
    extra = {"sistema_codigo": "PAR-CER-014", "l1": 85} if tipo == "aereo" else {"sistema_codigo": "LAJ-FLU-014"}
    d = calcular(tipo_analise=tipo, cenario=cenario, **extra).json()

    limite = d["criterios"]["referencia"]
    valor = d["criterios"]["valor"]
    assert limite == CRITERIOS_CENARIOS[tipo][cenario]["minimo"]
    atende = valor >= limite if tipo == "aereo" else valor <= limite
    assert (d["classificacao"] == "atende") is atende


@pytest.mark.parametrize("corpo", [
    {"tipo_analise": "aereo", "cenario": "parede_entre_unidades", "l1": 85, "camadas": DRYWALL_LA_75},
    {"tipo_analise": "impacto", "cenario": "laje_entre_unidades",
     "camadas": [{"material_id": 4, "espessura": 0.10}, {"material_id": 10, "espessura": 0.01}]},
    {"tipo_analise": "impacto", "cenario": "laje_entre_unidades", "sistema_codigo": "PAR-CER-014"},
], ids=["parede-com-la-sem-ensaio", "laje-sem-ensaio", "impacto-com-sistema-de-parede"])
def test_sem_dado_nao_inventa_numero(corpo):
    d = calcular(**corpo).json()
    assert d["confiabilidade"] == "sem_dado"
    assert d["indicador_principal"] is None
    assert d.get("nivel_recebido") is None
    assert d.get("conforto") is None


@pytest.mark.parametrize("corpo,trecho", [
    ({"tipo_analise": "aereo", "cenario": "parede_entre_unidades", "l1": 85, "sistema_codigo": "NAO-EXISTE"}, "não existe"),
    ({"tipo_analise": "aereo", "cenario": "parede_entre_unidades", "l1": 50, "l2": 60}, "L2"),
    ({"tipo_analise": "impacto", "cenario": "laje_entre_unidades"}, "nivel_impacto"),
], ids=["sistema-inexistente", "l2-maior-que-l1", "impacto-sem-dado-nenhum"])
def test_entradas_invalidas_explicam_o_problema(corpo, trecho):
    resp = calcular(**corpo)
    assert resp.status_code == 422
    assert trecho in resp.json()["detail"]
