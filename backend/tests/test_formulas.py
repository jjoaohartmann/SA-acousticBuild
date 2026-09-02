"""Testes do motor de calculo acustico — caso oficial (rebaselined grave a formula do Figma).

Formula adotada:  L2 = L1 + 10*log10(T2/T1) + R - 10*log10(S/A2)
Caso: S=15.5m2  V=30m3  T2=0.6s  T1=0.6s  R=52dB  L1=85dB
Esperado:        A2≈8.00   L2≈134.13   DnT≈-48.34   R'≈-46.26
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)) + '/..')

from formulas import calcular, absorcao_equivalente


def _quase(a, b, tol=0.02):
    return abs(a - b) <= tol


def test_caso_oficial():
    S, V, T2, T1, R, L1 = 15.5, 30.0, 0.6, 0.6, 52.0, 85.0
    res = calcular({
        'tipo_analise': 'aereo',
        'area_elemento': S,
        'volume_receptor': V,
        'reverberacao': T2,
        'reverberacao_emissor': T1,
        'reducao_sonora': R,
        'l1': L1,
    })

    a = res['detalhes']['absorcao_equivalente']
    l2 = res['detalhes']['l2_previsto']
    dnt = res['detalhes']['dnt']
    r_ap = res['indicador_secundario']['valor']

    assert _quase(a, 8.00), f'A esperado 8.00, obtido {a}'
    assert _quase(l2, 134.13), f'L2 esperado 134.13, obtido {l2}'
    assert _quase(dnt, -48.34), f'DnT esperado -48.34, obtido {dnt}'
    assert _quase(r_ap, -46.26), f"R' esperado -46.26, obtido {r_ap}"
    assert _quase(absorcao_equivalente(V, T2), 8.00)

    print('OK — caso oficial: A=%.4f L2=%.4f DnT=%.4f Rprime=%.4f' % (a, l2, dnt, r_ap))


def test_validacao_zero():
    base = {
        'tipo_analise': 'aereo',
        'area_elemento': 15.5,
        'volume_receptor': 30,
        'reverberacao': 0.6,
        'reverberacao_emissor': 0.6,
        'reducao_sonora': 52,
        'l1': 85,
    }
    for campo in ['area_elemento', 'volume_receptor', 'reverberacao', 'reducao_sonora', 'l1']:
        dados = dict(base)
        dados[campo] = 0
        try:
            calcular(dados)
            raise AssertionError(f'Deveria rejeitar {campo}=0')
        except ValueError:
            pass
    print('OK — campos <= 0 rejeitados sem log10 invalido')


def test_campo_ausente():
    dados = {'tipo_analise': 'aereo', 'area_elemento': 15.5}
    try:
        calcular(dados)
        raise AssertionError('Deveria rejeitar campo ausente')
    except ValueError:
        pass
    print('OK — campo ausente rejeitado')


if __name__ == '__main__':
    test_caso_oficial()
    test_validacao_zero()
    test_campo_ausente()
    print('\nTODOS OS TESTES PASSARAM = OK')