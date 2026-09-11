"""Criterios de classificacao parametrizados por cenario (NBR 15575 / ANSI S12.60).

Regras tecnicas:
- Isolamento Aereo (DnT): maior e melhor (operador 'min', limites crescentes).
- Ruido de Impacto (L'nT): menor e melhor (operador 'max', limites decrescentes).
- Tempo de Reverberacao (T): faixa ideal de 0.4 a 0.6 s para salas de aula (ANSI S12.60 / NBR 10152).
"""
from typing import Any

CRITERIOS_CENARIOS: dict[str, dict[str, dict[str, Any]]] = {
    'aereo': {
        'parede_entre_unidades': {
            'nome': 'Parede entre unidades habitacionais autonomas (NBR 15575-4)',
            'minimo': 45.0,
            'intermediario': 50.0,
            'superior': 55.0,
            'unidade': 'dB',
            'operador': 'min',
        },
        'parede_dormitorio_area_comum': {
            'nome': 'Parede entre dormitorio e areas comuns de transito (NBR 15575-4)',
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
            'nome': 'Isolamento aereo geral (Referencial NBR 15575-4)',
            'minimo': 45.0,
            'intermediario': 50.0,
            'superior': 55.0,
            'unidade': 'dB',
            'operador': 'min',
        },
    },
    'impacto': {
        'laje_entre_unidades': {
            'nome': 'Laje/piso entre unidades habitacionais autonomas (NBR 15575-5)',
            'minimo': 55.0,        # L'nT <= 55 dB
            'intermediario': 50.0, # L'nT <= 50 dB
            'superior': 45.0,      # L'nT <= 45 dB
            'unidade': 'dB',
            'operador': 'max',
        },
        'laje_coletiva_dormitorio': {
            'nome': 'Laje entre areas de uso coletivo e dormitorio (NBR 15575-5)',
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
            'nome': 'Ruido de impacto geral (Referencial NBR 15575-5)',
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


def avaliar_reverberacao(tempo_reverb: float | None) -> dict[str, Any]:
    """
    Avalia o tempo de reverberacao conforme a norma ANSI S12.60 e NBR 10152
    para ambientes de aprendizagem / salas de aula.
    """
    if tempo_reverb is None or tempo_reverb <= 0:
        return {'status': 'indisponivel', 'motivo': 'Tempo de reverberacao invalido.'}

    t = round(float(tempo_reverb), 2)
    if 0.40 <= t <= 0.60:
        return {
            'status': 'conforme',
            'nivel': 'ideal',
            'valor': t,
            'faixa_ideal': '0,40 s a 0,60 s',
            'diagnostico': 'Tempo de reverberacao dentro da faixa recomendada pela ANSI S12.60 para salas de aula, garantindo clareza e inteligibilidade da fala.',
        }
    elif t > 0.60:
        return {
            'status': 'alerta',
            'nivel': 'elevado',
            'valor': t,
            'faixa_ideal': '0,40 s a 0,60 s',
            'diagnostico': f'Tempo de reverberacao de {t:.2f} s esta acima do limite maximo recomendado pela ANSI S12.60 (0,60 s). O ambiente apresenta reverberacao excessiva, o que prejudica a compreensao da fala.',
        }
    else:
        return {
            'status': 'informativo',
            'nivel': 'baixo',
            'valor': t,
            'faixa_ideal': '0,40 s a 0,60 s',
            'diagnostico': f'Tempo de reverberacao de {t:.2f} s indica ambiente muito absorvente (seco).',
        }


def classificar(tipo: str, valor: float, cenario_id: str | None = None) -> dict[str, Any]:
    """
    Classifica o indicador com base no cenario parametrizado da NBR 15575.
    Retorna status, nivel (minimo, intermediario, superior, nao_atende ou indisponivel)
    e detalhes completos da avaliacao.
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
            'motivo': 'Criterio normativo nao configurado para este cenario.',
            'limite': None,
            'cenario_nome': None,
        }

    op: str = str(cenario['operador'])
    lim_min: float = float(cenario['minimo'])
    lim_inter: float = float(cenario['intermediario'])
    lim_sup: float = float(cenario['superior'])

    if op == 'min':
        # Para aereo: DnT maior ou igual e melhor
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
            f"O DnT obtido ({valor:.2f} dB) está {abs(delta):.2f} dB "
            f"{'acima' if delta >= 0 else 'abaixo'} do patamar mínimo de {lim_min:.0f} dB da NBR 15575."
        )
    else:
        # Para impacto: L'nT menor ou igual e melhor
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
            f"O L'nT obtido ({valor:.2f} dB) está {abs(valor - lim_min):.2f} dB "
            f"{'abaixo (conforme)' if atende else 'acima (não conforme)'} do limite máximo de {lim_min:.0f} dB da NBR 15575-5."
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