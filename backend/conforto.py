"""Tradução do resultado acústico para conforto percebido.

Duas camadas complementares ao julgamento normativo da NBR 15575:

1. ABNT NBR 10152:2017 (versão corrigida 2020) — níveis de pressão sonora
   recomendados DENTRO dos ambientes. Diferente do DnT (isolamento, "maior é
   melhor"), esta é uma escala em que menos decibéis é sempre melhor, o que a
   torna a referência mais intuitiva para o público leigo.

2. Tradução perceptiva — a escala em decibéis é logarítmica: uma redução de
   10 dB corresponde a aproximadamente metade do volume percebido pelo ouvido
   humano (GERGES, "Ruído: fundamentos e controle").

IMPORTANTE: os valores da NBR 10152 são LAeq de ruído de fundo do ambiente.
O nível calculado aqui vem de uma fonte específica no ambiente emissor e não é
ponderado em A. A comparação é, portanto, ORIENTATIVA (contextualiza o conforto)
e não substitui o julgamento normativo formal, que continua sendo o da NBR 15575.
"""
from typing import Any

from formatar import num

# NBR 10152:2017, Tabela 1 — nível recomendado por tipo de ambiente (dB)
AMBIENTES_NBR10152: dict[str, dict[str, Any]] = {
    'dormitorio': {'nome': 'Dormitório', 'recomendado': 35.0, 'artigo': 'no'},
    'sala_estar': {'nome': 'Sala de estar', 'recomendado': 40.0, 'artigo': 'na'},
    'sala_aula': {'nome': 'Sala de aula', 'recomendado': 40.0, 'artigo': 'na'},
    'biblioteca': {'nome': 'Biblioteca (área de leitura)', 'recomendado': 35.0, 'artigo': 'na'},
    'enfermaria': {'nome': 'Enfermaria / quarto hospitalar', 'recomendado': 35.0, 'artigo': 'na'},
    'escritorio': {'nome': 'Escritório individual', 'recomendado': 40.0, 'artigo': 'no'},
}

# Cada cenário da NBR 15575 implica um tipo de ambiente receptor
CENARIO_PARA_AMBIENTE: dict[str, str] = {
    'parede_entre_unidades': 'dormitorio',
    'parede_dormitorio_area_comum': 'dormitorio',
    'sala_aula_educacional': 'sala_aula',
    'generico': 'sala_estar',
    'laje_entre_unidades': 'dormitorio',
    'laje_coletiva_dormitorio': 'dormitorio',
    'laje_escolar_educacional': 'sala_aula',
}

# Âncoras do cotidiano para dar escala ao número (dB aproximados)
REFERENCIAS_COTIDIANO: list[dict[str, Any]] = [
    {'nivel': 20.0, 'descricao': 'Sussurro / quarto muito silencioso'},
    {'nivel': 30.0, 'descricao': 'Biblioteca silenciosa'},
    {'nivel': 40.0, 'descricao': 'Área residencial tranquila à noite'},
    {'nivel': 50.0, 'descricao': 'Conversa em voz baixa / geladeira'},
    {'nivel': 60.0, 'descricao': 'Conversa normal a 1 metro'},
    {'nivel': 70.0, 'descricao': 'Aspirador de pó / TV alta'},
    {'nivel': 80.0, 'descricao': 'Trânsito intenso'},
]


def referencia_mais_proxima(nivel: float) -> str:
    """Devolve a situação do cotidiano com nível mais próximo do calculado."""
    ancora = min(REFERENCIAS_COTIDIANO, key=lambda r: abs(r['nivel'] - nivel))
    return ancora['descricao']


def traduzir_percepcao(diferenca_db: float) -> str:
    """Converte uma diferença em dB para volume percebido (10 dB ≈ metade)."""
    d = abs(diferenca_db)
    if d < 1.0:
        return 'praticamente no limite recomendado'
    if d < 3.0:
        return 'diferença pouco perceptível'
    if d < 6.0:
        return 'diferença claramente audível'
    if d < 10.0:
        return 'diferença bastante audível'
    vezes = 2 ** (d / 10.0)
    return f'cerca de {num(vezes, 1)}'.replace('.', ',') + '× mais alto do que o recomendado'


OBSERVACAO_AEREO = (
    'Comparação orientativa: a NBR 10152 trata de nível de ruído de fundo (LAeq) '
    'do ambiente. O julgamento normativo formal deste cálculo é o da NBR 15575.'
)
# No piso a distância entre as duas grandezas é ainda maior, e precisa ser dita.
OBSERVACAO_IMPACTO = (
    "Comparação orientativa: o L'nT,w vem de uma máquina de impacto padronizada, "
    'não de passos reais, e a NBR 10152 trata de ruído de fundo (LAeq) do ambiente. '
    'O julgamento normativo formal deste cálculo é o da NBR 15575-3.'
)


def resolver_ambiente(cenario: str | None, ambiente_tipo: str | None) -> str:
    """Chave do ambiente NBR 10152: o que o usuário escolheu ou, na falta, o
    palpite derivado do cenário NBR 15575."""
    if ambiente_tipo in AMBIENTES_NBR10152:
        return ambiente_tipo
    return CENARIO_PARA_AMBIENTE.get(cenario or '', 'sala_estar')


def avaliar_conforto(
    nivel_recebido: float | None,
    cenario: str | None,
    ambiente_tipo: str | None = None,
    tipo: str = 'aereo',
) -> dict[str, Any] | None:
    """Compara o nível que chega ao ambiente receptor com a NBR 10152.

    Escala sempre no sentido intuitivo: quanto menos decibéis, melhor.

    `ambiente_tipo` é o eixo de conforto escolhido pelo usuário e é independente
    do `cenário` (eixo da exigência legal da NBR 15575). Quando não informado,
    deriva-se um palpite a partir do cenário.
    """
    if nivel_recebido is None:
        return None

    chave = resolver_ambiente(cenario, ambiente_tipo)
    ambiente = AMBIENTES_NBR10152[chave]
    recomendado = float(ambiente['recomendado'])
    nivel = float(nivel_recebido)
    diferenca = nivel - recomendado

    if diferenca <= 0:
        status = 'confortavel'
        resumo = (
            f'O nível estimado ({num(nivel, 1)} dB) está dentro do recomendado pela '
            f'NBR 10152 para {ambiente["nome"].lower()} (até {num(recomendado, 0)} dB).'
        )
    elif diferenca <= 5:
        status = 'aceitavel'
        resumo = (
            f'O nível estimado ({num(nivel, 1)} dB) ultrapassa em {num(diferenca, 1)} dB o recomendado '
            f'pela NBR 10152 para {ambiente["nome"].lower()} ({num(recomendado, 0)} dB) — {traduzir_percepcao(diferenca)}.'
        )
    else:
        status = 'desconfortavel'
        resumo = (
            f'O nível estimado ({num(nivel, 1)} dB) ultrapassa em {num(diferenca, 1)} dB o recomendado '
            f'pela NBR 10152 para {ambiente["nome"].lower()} ({num(recomendado, 0)} dB) — {traduzir_percepcao(diferenca)}.'
        )

    # Escala da régua visual: sempre com o recomendado e o resultado dentro do intervalo
    escala_max = max(70.0, nivel + 10.0)

    return {
        'norma': 'ABNT NBR 10152:2017',
        'ambiente': ambiente['nome'],
        'artigo': ambiente['artigo'],
        'nivel_estimado': round(nivel, 1),
        'recomendado': recomendado,
        'diferenca': round(diferenca, 1),
        'status': status,
        'resumo': resumo,
        'comparacao_cotidiano': referencia_mais_proxima(nivel),
        'escala': {'min': 20.0, 'max': round(escala_max, 1)},
        'referencias': REFERENCIAS_COTIDIANO,
        'observacao': OBSERVACAO_IMPACTO if tipo in ('impacto', 'lnt') else OBSERVACAO_AEREO,
    }
