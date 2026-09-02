# Motor de sugestoes.
#
# Camada 1: regras deterministicas em Python — funcionam sem dependencia externa.
# Camada 2 (opcional): narrar() apenas redige em linguagem natural o que a
# Camada 1 ja decidiu. NUNCA inventa numeros nem recomenda nuevas acoes.


def gerar_sugestoes(tipo, resultado):
    """
    Regras da Camada 1 baseadas no indicador de criterio (DnT p/ aereo,
    L'nT p/ impacto), nao no principal (que e o nivel previsto L2).

    Retorna lista de dicts: {'recomendacao': str, 'motivo': str}
    """
    sugestoes = []
    detalhes = resultado.get('detalhes', {})

    if tipo == 'aereo':
        valor = detalhes.get('dnt', resultado['indicador_principal']['valor'])
    else:
        valor = resultado['indicador_principal']['valor']

    if tipo == 'aereo':
        if valor < 30:
            sugestoes.append({
                'recomendacao': 'Trocar o material do elemento',
                'motivo': 'Isolamento muito baixo — buscar material com indice de reducao sonora (R) superior.',
            })
        elif valor < 45:
            sugestoes.append({
                'recomendacao': 'Reforcar a vedacao/frestas do elemento',
                'motivo': 'Perdas por frestas tipicamente reduzem a diferenca medida em relacao ao material.',
            })
        else:
            sugestoes.append({
                'recomendacao': 'Manter a solucao atual',
                'motivo': 'O isolamento ja atende aos patamares comuns de conforto acustico.',
            })
    elif tipo == 'impacto':
        if valor > 78:
            sugestoes.append({
                'recomendacao': 'Adicionar piso flutuante ou material resiliente',
                'motivo': 'Nivel de impacto elevado pede desacoplamento entre piso e estrutura.',
            })
        elif valor > 65:
            sugestoes.append({
                'recomendacao': 'Reforcar a laje/capa com desacoplamento acustico',
                'motivo': 'Nivel de impacto moderado pode ser reduzido com desacoplamento a camadas.',
            })
        else:
            sugestoes.append({
                'recomendacao': 'Manter a solucao atual',
                'motivo': 'O nivel de impacto esta confortavel em relacao a patamares comuns.',
            })

    # sugestao generica baseada na absorcao equivalente (util para ambos os tipos)
    a = detalhes.get('absorcao_equivalente')
    if a is not None and a < 8:
        sugestoes.append({
            'recomendacao': 'Aumentar a absorcao sonora do ambiente receptor',
            'motivo': 'Absorcao equivalente baixa eleva o nivel sonoro projetado no receptor.',
        })

    return sugestoes


def narrar(tipo, resultado, sugestoes):
    """
    Camada 2 (opcional, RDICAO): apenas narra o que as regras ja decidiram.
    Nao gera novos numeros. Se indisponivel, descreve o motivo do mesmo modo.
    """
    principal = resultado['indicador_principal']
    valor = principal['valor']
    unidade = principal['unidade']
    partes = []
    partes.append(
        f'O {principal["nome"]} estimado para este cenario e de aproximadamente '
        f'{valor:.2f} {unidade}.'
    )

    if sugestoes:
        partes.append('Com base nas regras tecnicas, recomendamos:')
        for s in sugestoes:
            partes.append(f'- {s["recomendacao"]} ({s["motivo"]})')
    else:
        partes.append('Nenhuma recomendacao adicional foi gerada pelas regras.')

    return {
        'tipo': tipo,
        'narrativa': ' '.join(partes),
        'fonte': 'regras-deterministicas',
    }