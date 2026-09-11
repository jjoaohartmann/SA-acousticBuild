"""Motor de recomendacoes tecnicas para desempenho acustico.

Regras deterministicas (Camada 1) alinhadas a fisica acustica e as normas
NBR 15575 (partes 4 e 5), ANSI S12.60 e aos estudos de caso de obra.
"""


def gerar_sugestoes(tipo: str, resultado: dict) -> list[dict]:
    """Gera recomendacoes acionaveis e fisicamente coerentes."""
    sugestoes = []
    detalhes = resultado.get('detalhes', {})
    principal = resultado.get('indicador_principal', {})

    tipo_norm = 'impacto' if tipo in ('impacto', 'lnt') else 'aereo'

    if tipo_norm == 'aereo':
        dnt = detalhes.get('dnt', principal.get('valor', 0))

        if dnt < 35.0:
            sugestoes.append({
                'recomendacao': 'Substituir ou duplicar o elemento separador',
                'motivo': (
                    'Isolamento acústico insuficiente (DnT < 35 dB). Recomenda-se sistema de parede dupla '
                    'desolidarizada ou reforço de drywall com chapas duplas de alta densidade e preenchimento '
                    'integral da cavidade com lã mineral (rocha ou vidro).'
                ),
            })
            sugestoes.append({
                'recomendacao': 'Verificar caixas elétricas e passagens de tubulação',
                'motivo': (
                    'Caixas de tomada posicionadas costas com costas e passagens de instalações vazadas '
                    'criam pontes acústicas severas que anulam o isolamento da partição.'
                ),
            })
        elif dnt < 45.0:
            sugestoes.append({
                'recomendacao': 'Tratamento de frestas e vedação perimetral com selante acústico',
                'motivo': (
                    'Isolamento abaixo do mínimo exigido pela NBR 15575 (45 dB). Frestas entre parede e laje, '
                    'portas ou juntas sem calafetação com mástique elástico reduzem sensivelmente o isolamento aparente.'
                ),
            })
            sugestoes.append({
                'recomendacao': 'Adicionar placa acústica de acabamento ou revestimento resiliente',
                'motivo': (
                    'A aplicação de uma placa de gesso adicional sobre a estrutura existente proporciona o ganho '
                    'de massa necessário para atingir o patamar regulatório.'
                ),
            })
        else:
            sugestoes.append({
                'recomendacao': 'Manter o sistema construtivo atual',
                'motivo': (
                    'O isolamento aéreo atende ou supera o desempenho mínimo estipulado pela NBR 15575.'
                ),
            })

    elif tipo_norm == 'impacto':
        lnt = detalhes.get('lnt', principal.get('valor', 0))

        if lnt > 65.0:
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
        elif lnt > 55.0:
            sugestoes.append({
                'recomendacao': 'Instalar revestimento de piso resiliente ou manta sob acabamento',
                'motivo': (
                    'Nível de impacto acima do limite máximo de 55 dB da NBR 15575-5. A troca para piso vinílico '
                    'acústico, carpete ou inserção de manta de amortecimento sob piso laminado atenua diretamente o impacto.'
                ),
            })
        else:
            sugestoes.append({
                'recomendacao': 'Manter a solução de piso e laje atual',
                'motivo': (
                    'O nível de ruído de impacto atende ao requisito regulatório da NBR 15575-5 (<= 55 dB).'
                ),
            })

    # Regra para Tempo de Reverberacao (especialmente ambientes de ensino / salas de aula)
    t = detalhes.get('t')
    if t is not None and t > 0.60:
        sugestoes.append({
            'recomendacao': 'Instalar forro acústico mineral ou painéis fonoabsorventes',
            'motivo': (
                f'Tempo de reverberação medido ({t:.2f} s) ultrapassa o limite de 0,60 s da norma ANSI S12.60 para salas de aula. '
                'A introdução de forro fonoabsorvente ou baffles reduz ecos e melhora a clareza da comunicação.'
            ),
        })

    # Regra para Absorcao Equivalente
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
    principal = resultado.get('indicador_principal', {})
    valor = principal.get('valor', 0)
    nome = principal.get('nome', '')
    unidade = principal.get('unidade', 'dB')

    tipo_nome = 'ruído de impacto' if tipo in ('impacto', 'lnt') else 'ruído aéreo'
    partes = [
        f"Para a análise de {tipo_nome}, o indicador principal obtido foi {nome} = {valor:.2f} {unidade}."
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