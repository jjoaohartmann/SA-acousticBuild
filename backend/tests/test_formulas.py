"""Testes do motor de calculo acustico - AcousticBuild.

Casos de teste oficiais:
TC-01: Caso Oficial da Especificacao Funcional (S=15.5, V=30, T=0.6, R=52, L1=85)
TC-02: Medicao in situ de Ruido Aereo (Espaço Maker - Artigo)
TC-03: Ensaio de Ruido de Impacto com Tapping Machine (Piso Escolar - Artigo)
TC-04: Rejeicao de entradas zero e negativas
TC-05: Rejeicao de campos obrigatorios ausentes
"""
import os
import sys

# Adiciona o diretorio backend ao sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from formulas import calcular  # type: ignore


def _quase(a: float, b: float, tol: float = 0.03) -> bool:
    return abs(a - b) <= tol


def test_tc01_caso_oficial_especificacao():
    """
    ENTRADA: S = 15,5 m2; V = 30 m3; T = 0,6 s; R = 52 dB; L1 = 85 dB.
    Saida esperada: A = 8,00 m2; L2 previsto ≈ 35,87 dB; DnT ≈ 49,92 dB.
    """
    dados = {
        'tipo_analise': 'aereo',
        'area_elemento': 15.5,
        'volume_receptor': 30.0,
        'reverberacao': 0.6,
        'reducao_sonora': 52.0,
        'l1': 85.0,
    }
    res = calcular(dados)

    a = res['detalhes']['absorcao_equivalente']
    l2 = res['detalhes']['l2_previsto']
    dnt = res['detalhes']['dnt']

    assert _quase(a, 8.00), f"A esperado 8.00, obtido {a}"
    assert _quase(l2, 35.87), f"L2 esperado 35.87, obtido {l2}"
    assert _quase(dnt, 49.92), f"DnT esperado 49.92, obtido {dnt}"
    assert res['indicador_principal']['nome'] == 'DnT'
    assert _quase(res['indicador_principal']['valor'], 49.92)
    print("[OK] TC-01 (Caso Oficial): A=8.00 m2, L2=35.87 dB, DnT=49.92 dB -> PASSOU")


def test_tc02_caso_medicao_aereo_artigo():
    """
    Espaço Maker - Medicao in situ com L1 e L2 medidos:
    S = 18.0 m2, V = 240.56 m3, T = 0.65 s, L1 = 90 dB, L2 = 51 dB.
    """
    dados = {
        'tipo_analise': 'aereo',
        'area_elemento': 18.0,
        'volume_receptor': 240.56,
        'reverberacao': 0.65,
        'l1': 90.0,
        'l2': 51.0,
    }
    res = calcular(dados)

    a = res['detalhes']['absorcao_equivalente']
    dnt = res['detalhes']['dnt']
    r_ap = res['indicador_secundario']['valor']

    # A = 0.16 * 240.56 / 0.65 = 59.2147
    assert _quase(a, 59.21, tol=0.1), f"A obtido {a}"
    # DnT = (90 - 51) + 10 * log10(0.65 / 0.5) = 39 + 1.139 = 40.14 dB
    assert _quase(dnt, 40.14, tol=0.1), f"DnT obtido {dnt}"
    # R' = (90 - 51) + 10 * log10(18 / 59.2147) = 39 - 5.17 = 33.83 dB
    assert _quase(r_ap, 33.83, tol=0.1), f"R' obtido {r_ap}"
    assert res['modo'] == 'medicao'
    print("[OK] TC-02 (Medicao Espaço Maker): A=59.21 m2, DnT=40.14 dB, R'=33.83 dB -> PASSOU")


def test_tc03_caso_impacto_tapping_machine():
    """
    Ensaio do artigo na escola com Tapping Machine:
    V = 234.28 m3, T = 0.70 s, Li = 62.0 dB.
    """
    dados = {
        'tipo_analise': 'impacto',
        'volume_receptor': 234.28,
        'reverberacao': 0.70,
        'nivel_impacto': 62.0,
    }
    res = calcular(dados)

    a = res['detalhes']['absorcao_equivalente']
    lnt = res['indicador_principal']['valor']
    ln = res['indicador_secundario']['valor']

    # A = 0.16 * 234.28 / 0.7 = 53.5497 m2
    assert _quase(a, 53.55, tol=0.1), f"A obtido {a}"
    # L'nT = 62 - 10 * log10(0.7 / 0.5) = 62 - 1.461 = 60.54 dB
    assert _quase(lnt, 60.54, tol=0.1), f"L'nT obtido {lnt}"
    # L'n = 62 + 10 * log10(53.5497 / 10) = 62 + 7.287 = 69.29 dB
    assert _quase(ln, 69.29, tol=0.1), f"L'n obtido {ln}"
    assert res['indicador_principal']['nome'] == "L'nT"
    print("[OK] TC-03 (Tapping Machine Escola): A=53.55 m2, L'nT=60.54 dB, L'n=69.29 dB -> PASSOU")


def test_tc04_validacao_zero_e_negativo():
    base = {
        'tipo_analise': 'aereo',
        'area_elemento': 15.5,
        'volume_receptor': 30.0,
        'reverberacao': 0.6,
        'reducao_sonora': 52.0,
        'l1': 85.0,
    }
    for campo in ['area_elemento', 'volume_receptor', 'reverberacao', 'reducao_sonora', 'l1']:
        for valor_invalido in [0, -5]:
            dados = dict(base)
            dados[campo] = valor_invalido
            rejeitou = False
            try:
                calcular(dados)
            except ValueError:
                rejeitou = True
            assert rejeitou, f"Deveria ter rejeitado {campo}={valor_invalido}"
    print("[OK] TC-04 (Validação zero/negativo): rejeitou todos os valores inválidos -> PASSOU")


def test_tc05_campos_ausentes():
    dados = {'tipo_analise': 'aereo', 'area_elemento': 15.5}
    rejeitou = False
    try:
        calcular(dados)
    except ValueError:
        rejeitou = True
    assert rejeitou, "Deveria ter rejeitado dados aereo incompletos"

    dados_impacto = {'tipo_analise': 'impacto', 'volume_receptor': 30.0}
    rejeitou = False
    try:
        calcular(dados_impacto)
    except ValueError:
        rejeitou = True
    assert rejeitou, "Deveria ter rejeitado dados impacto incompletos"
    print("[OK] TC-05 (Campos ausentes): rejeitou dados incompletos -> PASSOU")


if __name__ == '__main__':
    test_tc01_caso_oficial_especificacao()
    test_tc02_caso_medicao_aereo_artigo()
    test_tc03_caso_impacto_tapping_machine()
    test_tc04_validacao_zero_e_negativo()
    test_tc05_campos_ausentes()
    print("\nTODOS OS TESTES DE FORMULAS PASSARAM COM SUCESSO!")