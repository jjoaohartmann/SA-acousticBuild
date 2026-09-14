"""Testes dos 5 Casos Críticos da Calculadora AcousticBuild.

Conforme especificado no Plano de Implementação (Fases 3 e 8):
1. Mesmo ambiente + sistemas diferentes -> resultados diferentes
2. Sistema documentado + valor manual -> override claro com rastreabilidade
3. Composição sem dado acústico -> NÃO inventa decibéis (resultado None)
4. Espessura = 0 vs Espessura = None / Densidade = None (null != 0)
5. Sistema parecido, mas não igual -> NÃO herda desempenho do sistema cadastrado
"""
import os
import sys

import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from database import SessionLocal
from engine import executar_calculo_motor, resolver_propriedades_camadas
from models import Material


@pytest.fixture(scope="module")
def db():
    session = SessionLocal()
    yield session
    session.close()


def test_critico_1_mesmo_ambiente_sistemas_diferentes(db):
    """
    Teste Crítico 1:
    Mesmo ambiente (S=15 m2, V=45 m3, T=0.6 s) com dois sistemas diferentes (PAR-CER-014 vs PAR-CON-015).
    O resultado DnT,w deve ser obrigatoriamente diferente!
    """
    ambiente = {
        "tipo_analise": "aereo",
        "area_elemento": 15.0,
        "volume_receptor": 45.0,
        "reverberacao": 0.6,
    }

    req_cer = dict(ambiente, sistema_codigo="PAR-CER-014")
    req_con = dict(ambiente, sistema_codigo="PAR-CON-015")

    res_cer = executar_calculo_motor(req_cer, db=db)
    res_con = executar_calculo_motor(req_con, db=db)

    dnt_cer = res_cer["resultado"]["indicador_principal"]["valor"]
    dnt_con = res_con["resultado"]["indicador_principal"]["valor"]

    assert dnt_cer != dnt_con, f"Resultados deveriam ser distintos: CER={dnt_cer}, CON={dnt_con}"
    assert dnt_con > dnt_cer, f"Concreto 15cm (Rw=49) deve isolar mais que bloco 14cm (Rw=40): {dnt_con} vs {dnt_cer}"
    assert res_cer["resultado"]["indicador_principal"]["nome"] == "DnT,w"
    assert "IPT" in res_cer["fontes"][0]
    print(f"\n[OK] Teste Crítico 1: CER-014 ({dnt_cer} dB) != CON-015 ({dnt_con} dB)")


def test_critico_2_override_manual_sobrepoe_sistema(db):
    """
    Teste Crítico 2:
    Sistema documentado selecionado, mas o usuário fornece L1 e L2 medidos.
    O sistema deve priorizar a medição manual e rotular a confiabilidade como medicao_usuario.
    """
    dados = {
        "tipo_analise": "aereo",
        "area_elemento": 15.0,
        "volume_receptor": 45.0,
        "reverberacao": 0.6,
        "sistema_codigo": "PAR-CER-014",
        "l1": 90.0,
        "l2": 45.0,
    }

    res = executar_calculo_motor(dados, db=db)
    assert res["confiabilidade"] == "medicao_usuario"
    assert "medição informada pelo usuário" in res["origem"].lower()
    # DnT = (90 - 45) + 10*log10(0.6 / 0.5) = 45 + 0.7918 = 45.79 dB
    assert res["resultado"]["indicador_principal"]["valor"] == pytest.approx(45.79, rel=1e-2)
    print(f"\n[OK] Teste Crítico 2: Override manual aplicado com sucesso (confiabilidade: {res['confiabilidade']})")


def test_critico_3_composicao_com_camada_resiliente_nao_inventa_decibeis(db):
    """
    Teste Crítico 3:
    Composição com camada resiliente (lã de vidro, manta) e sem ensaio correspondente.

    A lei da massa descreve elementos que vibram como um corpo só. Uma camada leve no
    meio desacopla as faces e cria um sistema massa-mola-massa, cujo desempenho NÃO se
    deduz da massa superficial. Nesse caso o motor deve recusar, não estimar.
    """
    mat_placa = db.query(Material).filter(Material.nome.like("%gesso%")).first()
    mat_la = db.query(Material).filter(Material.densidade < 100).first()
    assert mat_placa and mat_la, "seed precisa ter placa de gesso e um material resiliente"

    camadas = [
        {"material_id": mat_placa.id, "espessura": 0.0125},
        {"material_id": mat_la.id, "espessura": 0.10},   # resiliente: desacopla as faces
        {"material_id": mat_placa.id, "espessura": 0.0125},
    ]

    dados = {
        "tipo_analise": "aereo",
        "area_elemento": 12.0,
        "volume_receptor": 35.0,
        "reverberacao": 0.5,
        "camadas": camadas,
    }

    res = executar_calculo_motor(dados, db=db)
    assert res["resultado"] is None, "Composição desacoplada sem ensaio NÃO pode gerar decibéis estimados!"
    assert res["confiabilidade"] == "sem_dado"
    assert len(res["limitacoes"]) > 0
    print("[OK] Teste Crítico 3: composição com camada resiliente não inventou decibéis")


def test_critico_3b_multicamada_rigida_pode_ser_estimada(db):
    """
    Contraparte do Crítico 3: camadas rígidas coladas (bloco + argamassa) vibram juntas,
    então a lei da massa se aplica sobre a massa somada — e o motor deve estimar,
    sempre rotulando o resultado como 'estimativa_teorica'.
    """
    mat_bloco = db.query(Material).filter(Material.categoria == "alvenaria").first()
    mat_arg = db.query(Material).filter(Material.nome.like("%rgamassa%")).first()
    assert mat_bloco and mat_arg

    dados = {
        "tipo_analise": "aereo",
        "area_elemento": 12.0,
        "volume_receptor": 35.0,
        "reverberacao": 0.5,
        "camadas": [
            {"material_id": mat_arg.id, "espessura": 0.02},
            {"material_id": mat_bloco.id, "espessura": 0.14},
            {"material_id": mat_arg.id, "espessura": 0.02},
        ],
    }

    res = executar_calculo_motor(dados, db=db)
    assert res["resultado"] is not None, "Composição rígida colada deve permitir estimativa"
    assert res["confiabilidade"] in ("estimativa_teorica", "ensaio_laboratorio")
    if res["confiabilidade"] == "estimativa_teorica":
        assert any("estimativa" in lim.lower() for lim in res["limitacoes"]),             "A estimativa precisa estar declarada nas limitações"
    print("[OK] Teste Crítico 3b: multicamada rígida estimada e rotulada corretamente")


def test_critico_4_diferenciacao_null_vs_zero_e_massa_superficial(db):
    """
    Teste Crítico 4:
    Verifica que:
    a) Espessura 0 é rejeitada como valor inválido (camada inexistente/nula).
    b) Se uma camada tem densidade desconhecida (None), a massa superficial total é None (não é calculada como se densidade fosse 0!).
    """
    # Teste 4a: Espessura 0
    with pytest.raises(ValueError, match="maior que zero"):
        resolver_propriedades_camadas([{"material_nome": "Bloco", "espessura": 0.0, "densidade": 1200.0}], db=db)

    # Teste 4b: Densidade desconhecida (None)
    res_fis = resolver_propriedades_camadas([
        {"material_nome": "Bloco Cerâmico", "espessura": 0.14, "densidade": None}
    ], db=db)

    assert res_fis["massa_superficial_total"] is None, "Densidade None NÃO pode virar 0 kg/m²!"
    assert res_fis["massa_completa"] is False
    assert res_fis["espessura_total_m"] == 0.14
    print(f"\n[OK] Teste Crítico 4: null != 0 respeitado (massa superficial: {res_fis['massa_superficial_total']})")


def test_critico_5_sistema_parecido_nao_herda_desempenho(db):
    """
    Teste Crítico 5:
    Sistema com bloco cerâmico 14 cm SEM argamassa (apenas 1 camada).
    O PAR-CER-014 possui 3 camadas (argamassa + bloco + argamassa, Rw=40 dB).
    O sistema de 1 camada NÃO pode herdar o Rw=40 do PAR-CER-014!
    """
    mat_bloco = db.query(Material).filter(Material.nome.like("%Bloco cerâmico%")).first()

    camadas = [
        {"material_id": mat_bloco.id, "espessura": 0.14}
    ]

    dados = {
        "tipo_analise": "aereo",
        "area_elemento": 15.0,
        "volume_receptor": 45.0,
        "reverberacao": 0.6,
        "camadas": camadas
    }

    res = executar_calculo_motor(dados, db=db)

    # Se usou modelo da lei da massa ou não encontrou dado, NÃO pode ter usado o PAR-CER-014 (Rw=40)
    sistema_utilizado = res.get("sistema_utilizado")
    assert sistema_utilizado is None, "Sistema de 1 camada NÃO deve herdar o código PAR-CER-014!"

    # Se gerou estimativa teórica pela lei da massa, deve estar categorizado como tal
    if res["resultado"] is not None:
        assert res["confiabilidade"] == "estimativa_teorica"
        assert "lei da massa" in res["metodo"]["nome"].lower()
    print(f"\n[OK] Teste Crítico 5: Não herdou desempenho de sistema parecido (confiabilidade: {res['confiabilidade']})")
