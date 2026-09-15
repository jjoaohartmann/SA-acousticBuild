"""Critérios de classificação parametrizados por cenário (NBR 15575 / ANSI S12.60).

Regras técnicas:
- Isolamento aéreo (DnT): maior é melhor (operador 'min', limites crescentes).
- Ruído de impacto (L'nT): menor é melhor (operador 'max', limites decrescentes).
- Tempo de reverberação (T): faixa ideal de 0,4 a 0,6 s para salas de aula (ANSI/ASA S12.60).
"""
from typing import Any

from formatar import num

CRITERIOS_CENARIOS: dict[str, dict[str, dict[str, Any]]] = {
    'aereo': {
        'parede_entre_unidades': {
            'nome': 'Parede entre unidades habitacionais autônomas (NBR 15575-4)',
            'minimo': 45.0,
            'intermediario': 50.0,
            'superior': 55.0,
            'unidade': 'dB',
            'operador': 'min',
        },
        'parede_dormitorio_area_comum': {
            'nome': 'Parede entre dormitório e áreas comuns de trânsito (NBR 15575-4)',
            'minimo': 40.0,
            'intermediario': 45.0,
            'superior': 50.0,
            'unidade': 'dB',
            'operador': 'min',
        },
        'sala_aula_educacional': {
            'nome': 'Salas de aula / Ambientes de ensino (Referencial NBR 15575 / Artigo)',
            'minimo': 45.0,
            'intermediario': 50.0,
            'superior': 55.0,
            'unidade': 'dB',
            'operador': 'min',
        },
        'generico': {
            'nome': 'Isolamento aéreo geral (Referencial NBR 15575-4)',
            'minimo': 45.0,
            'intermediario': 50.0,
            'superior': 55.0,
            'unidade': 'dB',
            'operador': 'min',
        },
    },
    'impacto': {
        'laje_entre_unidades': {
            'nome': 'Laje/piso entre unidades habitacionais autônomas (NBR 15575-3)',
            'minimo': 55.0,        # L'nT <= 55 dB
            'intermediario': 50.0, # L'nT <= 50 dB
            'superior': 45.0,      # L'nT <= 45 dB
            'unidade': 'dB',
            'operador': 'max',
        },
        'laje_coletiva_dormitorio': {
            'nome': 'Laje entre áreas de uso coletivo e dormitório (NBR 15575-3)',
            'minimo': 50.0,
            'intermediario': 45.0,
            'superior': 40.0,
            'unidade': 'dB',
            'operador': 'max',
        },
        'laje_escolar_educacional': {
            'nome': 'Piso entre salas de aula / Ambientes escolares (Referencial NBR 15575 / Artigo)',
            'minimo': 55.0,
            'intermediario': 50.0,
            'superior': 45.0,
            'unidade': 'dB',
            'operador': 'max',
        },
        'generico': {
            'nome': 'Ruído de impacto geral (Referencial NBR 15575-3)',
            'minimo': 55.0,
            'intermediario': 50.0,
            'superior': 45.0,
            'unidade': 'dB',
            'operador': 'max',
        },
    },
}

# Alias para compatibilidade retroativa
CRITERIOS = CRITERIOS_CENARIOS


# A ANSI/ASA S12.60 fixa 0,60 s como teto — mas só para salas de aula até 283 m³.
# Citar essa norma para um dormitório seria aplicá-la fora do escopo dela; nesses
# casos a faixa vira o que ela é de fato: referência geral de inteligibilidade.
AMBIENTES_ESCOLARES = {'sala_aula'}


def avaliar_reverberacao(
    tempo_reverb: float | None,
    ambiente_tipo: str | None = None,
) -> dict[str, Any]:
    """
    Avalia o tempo de reverberação do ambiente receptor.

    Para salas de aula o critério citado é a ANSI/ASA S12.60. Para os demais
    ambientes a mesma faixa (0,40 s a 0,60 s) é apresentada como referência
    de conforto para a fala, sem invocar uma norma que não os cobre.
    """
    if tempo_reverb is None or tempo_reverb <= 0:
        return {'status': 'indisponivel', 'motivo': 'Tempo de reverberação inválido.'}

    escolar = (ambiente_tipo or '') in AMBIENTES_ESCOLARES
    origem = (
        'recomendada pela ANSI/ASA S12.60 para salas de aula'
        if escolar else
        'usada como referência de conforto (a NBR 15575 não fixa limite de '
        'reverberação para este ambiente)'
    )
    teto = (
        'o limite máximo da ANSI/ASA S12.60 (0,60 s)'
        if escolar else
        'a faixa de conforto usual para a fala (0,60 s)'
    )

    t = round(float(tempo_reverb), 2)
    if 0.40 <= t <= 0.60:
        return {
            'status': 'conforme',
            'nivel': 'ideal',
            'valor': t,
            'faixa_ideal': '0,40 s a 0,60 s',
            'diagnostico': f'Tempo de reverberação de {num(t, 2)} s dentro da faixa {origem}, o que favorece a clareza e a inteligibilidade da fala.',
        }
    elif t > 0.60:
        return {
            'status': 'alerta',
            'nivel': 'elevado',
            'valor': t,
            'faixa_ideal': '0,40 s a 0,60 s',
            'diagnostico': f'Tempo de reverberação de {num(t, 2)} s está acima de {teto}. O ambiente ecoa mais do que o recomendado, o que prejudica a compreensão da fala.',
        }
    else:
        return {
            'status': 'informativo',
            'nivel': 'baixo',
            'valor': t,
            'faixa_ideal': '0,40 s a 0,60 s',
            'diagnostico': f'Tempo de reverberação de {num(t, 2)} s indica ambiente muito absorvente (seco).',
        }


def classificar(tipo: str, valor: float, cenario_id: str | None = None) -> dict[str, Any]:
    """
    Classifica o indicador com base no cenário parametrizado da NBR 15575.
    Retorna status, nível (minimo, intermediario, superior, nao_atende ou
    indisponivel — chaves sem acento, por serem identificadores) e os detalhes
    completos da avaliação.
    """
    tipo_key = 'impacto' if tipo in ('impacto', 'lnt') else 'aereo'
    tabela_tipo = CRITERIOS_CENARIOS.get(tipo_key, {})

    cenario: dict[str, Any] | None = None
    if cenario_id and cenario_id in tabela_tipo:
        cenario = tabela_tipo[cenario_id]
    elif 'generico' in tabela_tipo:
        cenario = tabela_tipo['generico']

    if cenario is None:
        return {
            'classificacao': 'indisponivel',
            'nivel': 'indisponivel',
            'motivo': 'Critério normativo não configurado para este cenário.',
            'limite': None,
            'cenario_nome': None,
        }

    op: str = str(cenario['operador'])
    lim_min: float = float(cenario['minimo'])
    lim_inter: float = float(cenario['intermediario'])
    lim_sup: float = float(cenario['superior'])

    if op == 'min':
        # Para aéreo: DnT maior ou igual é melhor
        if valor >= lim_sup:
            nivel = 'superior'
            atende = True
        elif valor >= lim_inter:
            nivel = 'intermediario'
            atende = True
        elif valor >= lim_min:
            nivel = 'minimo'
            atende = True
        else:
            nivel = 'nao_atende'
            atende = False

        delta = round(valor - lim_min, 2)
        motivo = (
            f"O DnT obtido ({num(valor, 2)} dB) está {num(abs(delta), 2)} dB "
            f"{'acima' if delta >= 0 else 'abaixo'} do patamar mínimo de {num(lim_min, 0)} dB da NBR 15575."
        )
    else:
        # Para impacto: L'nT menor ou igual é melhor
        if valor <= lim_sup:
            nivel = 'superior'
            atende = True
        elif valor <= lim_inter:
            nivel = 'intermediario'
            atende = True
        elif valor <= lim_min:
            nivel = 'minimo'
            atende = True
        else:
            nivel = 'nao_atende'
            atende = False

        delta = round(lim_min - valor, 2)
        motivo = (
            f"O L'nT obtido ({num(valor, 2)} dB) está {num(abs(valor - lim_min), 2)} dB "
            f"{'abaixo (conforme)' if atende else 'acima (não conforme)'} do limite máximo de {num(lim_min, 0)} dB da NBR 15575-3."
        )

    return {
        'classificacao': 'atende' if atende else 'nao_atende',
        'nivel': nivel,
        'limite': lim_min,
        'limites': {
            'minimo': lim_min,
            'intermediario': lim_inter,
            'superior': lim_sup,
        },
        'cenario_nome': cenario['nome'],
        'motivo': motivo,
        'operador': op,
    }