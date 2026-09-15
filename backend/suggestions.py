"""Motor de recomendações técnicas para desempenho acústico.

Regras determinísticas (Camada 1) alinhadas à física acústica e às normas
NBR 15575 (partes 3 e 4), ANSI/ASA S12.60 e aos estudos de caso de obra.
"""

from formatar import num


def gerar_sugestoes(tipo: str, resultado: dict, classificacao: dict | None = None) -> list[dict]:
    """Gera recomendações acionáveis, ancoradas nos limites REAIS do cenário escolhido.

    `classificacao` vem de criteria.classificar() e traz os limites do cenário
    (mínimo/intermediário/superior) e o nível alcançado. Sem ele, cai para os
    limites genéricos da NBR 15575.
    """
    sugestoes = []
    detalhes = resultado.get('detalhes', {})
    principal = resultado.get('indicador_principal', {})

    tipo_norm = 'impacto' if tipo in ('impacto', 'lnt') else 'aereo'

    limites = (classificacao or {}).get('limites') or {}
    nivel = (classificacao or {}).get('nivel')
    lim_min = float(limites.get('minimo', 45.0 if tipo_norm == 'aereo' else 55.0))
    lim_inter = float(limites.get('intermediario', lim_min + 5.0))
    lim_sup = float(limites.get('superior', lim_min + 10.0))

    if tipo_norm == 'aereo':
        dnt = detalhes.get('dnt', principal.get('valor', 0))
        falta = lim_min - dnt  # positivo => não atende

        if falta > 10.0:
            sugestoes.append({
                'recomendacao': 'Substituir ou duplicar o elemento separador',
                'motivo': (
                    f'Faltam {num(falta, 1)} dB para o mínimo de {num(lim_min, 0)} dB deste cenário — uma diferença '
                    'grande demais para tratamento superficial. Recomenda-se parede dupla desolidarizada ou '
                    'drywall com chapas duplas e preenchimento integral da cavidade com lã mineral.'
                ),
            })
            sugestoes.append({
                'recomendacao': 'Verificar caixas elétricas e passagens de tubulação',
                'motivo': (
                    'Caixas de tomada costas com costas e passagens de instalações vazadas criam pontes '
                    'acústicas que anulam boa parte do isolamento da partição.'
                ),
            })
        elif falta > 0:
            sugestoes.append({
                'recomendacao': 'Tratamento de frestas e vedação perimetral com selante acústico',
                'motivo': (
                    f'Faltam apenas {num(falta, 1)} dB para o mínimo de {num(lim_min, 0)} dB deste cenário. Frestas entre '
                    'parede e laje, portas e juntas sem calafetação costumam responder por essa diferença.'
                ),
            })
            sugestoes.append({
                'recomendacao': 'Adicionar placa acústica de acabamento ou revestimento resiliente',
                'motivo': (
                    'Uma placa de gesso adicional sobre a estrutura existente costuma render o ganho de massa '
                    f'necessário para cruzar o patamar de {num(lim_min, 0)} dB.'
                ),
            })
        elif nivel == 'minimo' or dnt < lim_inter:
            sugestoes.append({
                'recomendacao': 'Sistema aprovado no nível mínimo — há margem para melhorar',
                'motivo': (
                    f'Com {num(dnt, 1)} dB o sistema cumpre o mínimo de {num(lim_min, 0)} dB, mas fica '
                    f'{num(lim_inter - dnt, 1)} dB abaixo do nível intermediário ({num(lim_inter, 0)} dB). Vedar frestas '
                    'e tratar passagens elétricas costuma render esses decibéis sem trocar o sistema.'
                ),
            })
        elif dnt < lim_sup:
            sugestoes.append({
                'recomendacao': 'Bom desempenho — nível intermediário atingido',
                'motivo': (
                    f'{num(dnt, 1)} dB supera o intermediário ({num(lim_inter, 0)} dB). Para alcançar o nível superior '
                    f'({num(lim_sup, 0)} dB) seria necessário ganho de massa ou desolidarização do sistema.'
                ),
            })
        else:
            sugestoes.append({
                'recomendacao': 'Excelente desempenho — nível superior da NBR 15575',
                'motivo': (
                    f'{num(dnt, 1)} dB atinge o patamar superior ({num(lim_sup, 0)} dB), o mais alto previsto pela norma '
                    'para este cenário. Nenhuma intervenção de isolamento é necessária.'
                ),
            })

    elif tipo_norm == 'impacto':
        lnt = detalhes.get('lnt', principal.get('valor', 0))

        excesso = lnt - lim_min  # positivo => não atende

        if excesso > 10.0:
            sugestoes.append({
                'recomendacao': 'Implementar contrapiso flutuante com manta acústica resiliente',
                'motivo': (
                    'Transmissão de impacto severa (L\'nT > 65 dB, similar ao piso cerâmico sem tratamento). '
                    'É indispensável a execução de contrapiso flutuante desacoplado da laje por manta de polietileno '
                    'expandido, lã de rocha de alta densidade ou borracha, com virada perimetral nas paredes.'
                ),
            })
            sugestoes.append({
                'recomendacao': 'Desolidarizar rodapés e esquadrias em contato com o piso',
                'motivo': (
                    'Evitar o contato rígido entre os rodapés cerâmicos e o contrapiso flutuante para não formar '
                    'pontes acústicas laterais de vibração.'
                ),
            })
        elif excesso > 0:
            sugestoes.append({
                'recomendacao': 'Instalar revestimento de piso resiliente ou manta sob acabamento',
                'motivo': (
                    f'O nível ultrapassa em {num(excesso, 1)} dB o máximo de {num(lim_min, 0)} dB deste cenário. A troca para piso vinílico '
                    'acústico, carpete ou inserção de manta de amortecimento sob piso laminado atenua diretamente o impacto.'
                ),
            })
        else:
            sugestoes.append({
                'recomendacao': 'Manter a solução de piso e laje atual',
                'motivo': (
                    f'Com {num(lnt, 1)} dB o sistema cumpre o máximo de {num(lim_min, 0)} dB deste cenário (quanto menor, melhor).'
                ),
            })

    # Regra para tempo de reverberação (sobretudo ambientes de ensino)
    t = detalhes.get('t')
    if t is not None and t > 0.60:
        sugestoes.append({
            'recomendacao': 'Instalar forro acústico mineral ou painéis fonoabsorventes',
            'motivo': (
                f'Tempo de reverberação de {num(t, 2)} s: acima de 0,60 s o ambiente ecoa e a fala '
                'fica menos inteligível (limite da ANSI/ASA S12.60 para salas de aula, usado aqui '
                'como referência de conforto). A introdução de forro fonoabsorvente ou baffles '
                'reduz ecos e melhora a clareza da comunicação.'
            ),
        })

    # Regra para absorção equivalente
    a = detalhes.get('absorcao_equivalente')
    v = detalhes.get('v')
    if a is not None and v is not None and v > 40 and a < 10:
        sugestoes.append({
            'recomendacao': 'Aumentar a absorção sonora do ambiente receptor',
            'motivo': (
                'Área de absorção equivalente reduzida para o volume da sala amplifica a sensação de reverberação e reverberância sonora.'
            ),
        })

    return sugestoes


def narrar(tipo: str, resultado: dict, sugestoes: list[dict]) -> dict:
    """Narra em linguagem natural e técnica o resumo dos resultados obtidos."""
    # sistemas do catálogo e estimativas aninham o indicador em `resultado`;
    # sem isso a frase saía "o indicador principal obtido foi  = 0,00 dB"
    principal = (
        resultado.get('indicador_principal')
        or (resultado.get('resultado') or {}).get('indicador_principal')
        or {}
    )
    valor = principal.get('valor', 0)
    nome = principal.get('nome', '')
    unidade = principal.get('unidade', 'dB')

    tipo_nome = 'ruído de impacto' if tipo in ('impacto', 'lnt') else 'ruído aéreo'
    partes = [
        f"Para a análise de {tipo_nome}, o indicador principal obtido foi {nome} = {num(valor, 2)} {unidade}."
    ]

    if sugestoes:
        partes.append("Ações técnicas recomendadas:")
        for s in sugestoes:
            partes.append(f"• {s['recomendacao']}: {s['motivo']}")

    return {
        'tipo': tipo,
        'narrativa': ' '.join(partes),
        'fonte': 'regras-tecnicas-normativas',
    }