"""Motor de cálculo acústico - AcousticBuild.

Implementação rigorosa das normas ABNT NBR ISO 16283-1/2, ISO 12354-1/2, ISO 717-1/2 e NBR 15575.
Compatível com chamadas analíticas diretas e com o motor relacional da Fase 3.
"""
from __future__ import annotations

import math
from typing import Any

from engine import (
    A0,
    T0,
    calcular_absorcao_sabine,
    executar_calculo_motor,
)


def absorcao_equivalente(volume: float, tempo_reverb: float) -> float:
    """Calcula a absorção equivalente do ambiente receptor pela formula de Sabine: A = 0.16 * V / T."""
    return calcular_absorcao_sabine(volume, tempo_reverb)


# Faixas fisicamente plausiveis para ambientes construidos (ISO 12354 / NBR 15575)
FAIXAS_PLAUSIVEIS = {
    'area_elemento': (0.5, 500.0, 'm²'),
    'volume_receptor': (1.0, 10000.0, 'm³'),
    'reverberacao': (0.1, 5.0, 's'),
    'l1': (20.0, 140.0, 'dB'),
    'l2': (10.0, 140.0, 'dB'),
    'nivel_impacto': (20.0, 140.0, 'dB'),
    'reducao_sonora': (1.0, 80.0, 'dB'),
}


def _validar_positivo(valores):
    """Valida presenca, positividade e plausibilidade física dos campos."""
    for nome, valor in valores:
        if valor is None:
            raise ValueError(f"Campo obrigatório ausente: {nome}")
        try:
            v = float(valor)
        except (TypeError, ValueError) as e:
            raise ValueError(f"Campo inválido (deve ser número): {nome}") from e
        if v <= 0:
            raise ValueError(f"{nome} deve ser estritamente maior que zero (recebido: {valor})")
        faixa = FAIXAS_PLAUSIVEIS.get(nome)
        if faixa and not (faixa[0] <= v <= faixa[1]):
            raise ValueError(
                f"{nome} = {valor} {faixa[2]} está fora da faixa plausível "
                f"({faixa[0]:g} a {faixa[1]:g} {faixa[2]}). Confira o valor informado."
            )


def calcular_tipo_aereo(dados):
    """
    Cálculo de isolamento ao ruído aéreo (EN 12354-1 / ISO 16283-1).
    """
    S = dados.get('area_elemento') or dados.get('s')
    V = dados.get('volume_receptor') or dados.get('v')
    T = dados.get('reverberacao') or dados.get('t') or dados.get('t2')
    L1 = dados.get('l1')

    _validar_positivo([
        ('area_elemento', S),
        ('volume_receptor', V),
        ('reverberacao', T),
        ('l1', L1),
    ])

    S = float(S)
    V = float(V)
    T = float(T)
    L1 = float(L1)

    A = absorcao_equivalente(V, T)

    L2_medido = dados.get('l2')
    R_informado = dados.get('reducao_sonora') or dados.get('r')

    if L2_medido is not None and str(L2_medido).strip() != '':
        try:
            L2_val = float(L2_medido)
        except (TypeError, ValueError) as e:
            raise ValueError("L2 medido deve ser um número válido.") from e
        if not (10.0 <= L2_val <= 140.0):
            raise ValueError("L2 medido deve ficar entre 10 e 140 dB. Confira a leitura do sonometro.")
        if L2_val > L1:
            raise ValueError("O nível no receptor (L2) não pode ser maior que o do emissor (L1).")

        L2 = L2_val
        DnT = (L1 - L2) + 10.0 * math.log10(T / T0)
        R_aparente = (L1 - L2) + 10.0 * math.log10(S / A)
        modo = "medicao"
        r_display = R_aparente
        confiabilidade = "medicao_usuario"
        origem = "Resultado baseado em medição informada pelo usuário"
        fontes = ["Medição in situ informada pelo usuário"]
        limitacoes = ["Resultado obtido a partir de medição in situ de L1 e L2."]
    else:
        if R_informado is None or str(R_informado).strip() == '':
            raise ValueError("Informe o indice de redução sonora R (ou o nível medido L2).")
        try:
            R_val = float(R_informado)
        except (TypeError, ValueError) as e:
            raise ValueError("Redução sonora R deve ser um número válido.") from e
        if not (1.0 <= R_val <= 80.0):
            raise ValueError("Redução sonora R deve ficar entre 1 e 80 dB — acima disso nenhum sistema construtivo real alcanca.")

        L2 = L1 - R_val + 10.0 * math.log10(S / A)
        DnT = (L1 - L2) + 10.0 * math.log10(T / T0)
        R_aparente = R_val
        modo = "previsao"
        r_display = R_val
        confiabilidade = "informado_usuario"
        origem = "Resultado baseado em valor informado pelo usuário"
        fontes = ["Valor informado pelo usuário"]
        limitacoes = ["O cálculo assume que o valor informado corresponde ao índice de redução sonora do elemento."]

    return {
        'tipo': 'aereo',
        'modo': modo,
        'areas': {
            'absorcao_equivalente': round(A, 4)
        },
        'indicador_principal': {
            'nome': 'DnT',
            'descricao': 'Diferenca de nível padronizada',
            'valor': round(DnT, 2),
            'valor_exato': DnT,
            'unidade': 'dB',
        },
        'indicador_secundario': {
            'nome': "R'" if modo == "medicao" else "R",
            'descricao': 'Indice de redução sonora aparente' if modo == "medicao" else 'Indice de redução sonora do material',
            'valor': round(r_display, 2),
            'valor_exato': r_display,
            'unidade': 'dB',
        },
        'resultado': {
            'indicador_principal': {
                'nome': 'DnT',
                'descricao': 'Diferenca de nível padronizada',
                'valor': round(DnT, 2),
                'valor_exato': DnT,
                'unidade': 'dB',
            },
            'indicador_secundario': {
                'nome': "R'" if modo == "medicao" else "R",
                'descricao': 'Indice de redução sonora aparente' if modo == "medicao" else 'Indice de redução sonora do material',
                'valor': round(r_display, 2),
                'valor_exato': r_display,
                'unidade': 'dB',
            }
        },
        'metodo': {
            'nome': 'Previsão de isolamento ao ruído aéreo' if modo == 'previsao' else 'Medição in situ de isolamento aéreo',
            'norma': 'ABNT NBR ISO 16283-1 / ISO 717-1',
            'equacao': 'DnT = (L1 - L2) + 10*log10(T / T0)'
        },
        'confiabilidade': confiabilidade,
        'origem': origem,
        'fontes': fontes,
        'limitacoes': limitacoes,
        'detalhes': {
            'dnt': round(DnT, 2),
            'l2_previsto': round(L2, 2),
            'l2_exato': L2,
            'l1': L1,
            'r': round(r_display, 2),
            's': S,
            'v': V,
            't': T,
            'absorcao_equivalente': round(A, 2),
            'absorcao_exata': A,
            'modo': modo,
        },
    }


def calcular_tipo_impacto(dados):
    """
    Cálculo do nível de pressao sonora de impacto (EN 12354-2 / ISO 16283-2).
    """
    V = dados.get('volume_receptor') or dados.get('v')
    T = dados.get('reverberacao') or dados.get('t') or dados.get('t2')
    Li = dados.get('nivel_impacto') or dados.get('li')

    _validar_positivo([
        ('volume_receptor', V),
        ('reverberacao', T),
        ('nivel_impacto', Li),
    ])

    V = float(V)
    T = float(T)
    Li = float(Li)

    A = absorcao_equivalente(V, T)

    # Formula padronizada: L'nT = Li - 10*log10(T / T0)
    LnT = Li - 10.0 * math.log10(T / T0)

    # Formula normalizada: L'n = Li + 10*log10(A / A0)
    Ln = Li + 10.0 * math.log10(A / A0)

    return {
        'tipo': 'impacto',
        'areas': {
            'absorcao_equivalente': round(A, 4)
        },
        'indicador_principal': {
            'nome': "L'nT",
            'descricao': 'Nível de pressao sonora de impacto padronizado',
            'valor': round(LnT, 2),
            'valor_exato': LnT,
            'unidade': 'dB',
        },
        'indicador_secundario': {
            'nome': "L'n",
            'descricao': 'Nível de pressao sonora de impacto normalizado',
            'valor': round(Ln, 2),
            'valor_exato': Ln,
            'unidade': 'dB',
        },
        'resultado': {
            'indicador_principal': {
                'nome': "L'nT",
                'descricao': 'Nível de pressao sonora de impacto padronizado',
                'valor': round(LnT, 2),
                'valor_exato': LnT,
                'unidade': 'dB',
            },
            'indicador_secundario': {
                'nome': "L'n",
                'descricao': 'Nível de pressao sonora de impacto normalizado',
                'valor': round(Ln, 2),
                'valor_exato': Ln,
                'unidade': 'dB',
            }
        },
        'metodo': {
            'nome': 'Medição de ruído de impacto com máquina de percussão padronizada',
            'norma': 'ABNT NBR ISO 16283-2 / ISO 717-2',
            'equacao': "L'nT = Li - 10*log10(T / T0)"
        },
        'confiabilidade': 'medicao_usuario',
        'origem': 'Resultado baseado em medição informada pelo usuário',
        'fontes': ['Ensaio in situ com máquina de percussão padronizada'],
        'limitacoes': ['Nível de impacto Li medido e informado pelo usuário.'],
        'detalhes': {
            'lnt': round(LnT, 2),
            'ln': round(Ln, 2),
            'li': Li,
            'v': V,
            't': T,
            'absorcao_equivalente': round(A, 2),
            'absorcao_exata': A,
        },
    }


def calcular(dados: dict[str, Any], db: Any | None = None) -> dict[str, Any]:
    """
    Orquestrador público da calculadora:
    Se os dados contiverem sistema cadastrado (sistema_codigo / sistema_id) ou lista de camadas personalizadas,
    despacha para o motor de decisão avançado (executar_calculo_motor).
    Caso contrário, executa o cálculo de previsão/medição analítica clássico.
    """
    if dados.get("sistema_codigo") or dados.get("sistema_id") or dados.get("camadas"):
        return executar_calculo_motor(dados, db=db)

    tipo = str(dados.get('tipo_analise', 'aereo')).lower()
    if tipo in ('impacto', 'lnt'):
        return calcular_tipo_impacto(dados)
    return calcular_tipo_aereo(dados)