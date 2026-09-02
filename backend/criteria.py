# Criterios de classificacao parametrizados por cenario (NBR 15575 / ISO 717).
# Valores de exemplo — ajuste conforme a norma/especificacao de cada projeto.

CRITERIOS = {
    # isolamento ao ruido aereo: valor minimo exigido de DnT (dB)
    'aereo': {'operador': 'min', 'limite': 45.0},
    # nivel de impacto: valor maximo permitido de L'nT (dB)
    'impacto': {'operacao': 'max', 'limite': 58.0},
}


def classificar(tipo: str, valor: float):
    """
    Classifica o resultado em 'atende' | 'nao_atende' | 'indisponivel'.

    Retorna um dict com:
        status   - classificacao
        motivo   - descricao (preenchido quando 'indisponivel' ou detalhe do criterio)
    """
    criterio = CRITERIOS.get(tipo)
    if criterio is None:
        return {
            'classificacao': 'indisponivel',
            'motivo': 'Criterio nao configurado para este cenario.',
            'limite': None,
        }

    op = criterio.get('operacao') or criterio.get('operador') or 'min'
    limite = criterio['limite']

    if op == 'min':
        atende = valor >= limite
        comparacao = '>=' if atende else '<'
    elif op == 'max':
        atende = valor <= limite
        comparacao = '<=' if atende else '>'
    else:
        return {
            'classificacao': 'indisponivel',
            'motivo': f'Operador desconhecido "{op}".',
            'limite': None,
        }

    return {
        'classificacao': 'atende' if atende else 'nao_atende',
        'limite': limite,
        'motivo': f'{tipo} {comparacao} {limite} dB inerente ao criterio configurado.',
    }