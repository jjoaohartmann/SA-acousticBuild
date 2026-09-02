import math

# Constantes de normalizacao (ISO 717 / NBR 15575)
T0 = 0.5      # tempo de reverberacao de referencia (segundos)
A0 = 10.0     # area de absorcao equivalente de referencia (m2)
K  = 0.16     # constante de Sabine para ambientes tipicos


def absorcao_equivalente(volume: float, tempo_reverb: float) -> float:
    """A = (K * V) / T   (formula de Sabine)."""
    return K * volume / tempo_reverb


def _validar_positivo(valores):
    """Valida presenca e positividade de todos os campos numericos antes de qualquer log10."""
    for nome, valor in valores:
        if valor is None:
            raise ValueError(f'Campo obrigatorio ausente: {nome}')
        try:
            v = float(valor)
        except (TypeError, ValueError):
            raise ValueError(f'Campo invalido (deve ser numero): {nome}')
        if v <= 0:
            raise ValueError(f'{nome} deve ser maior que zero (recebido: {valor})')


def calcular_tipo_aereo(dados):
    """
    Isolamento ao ruido aereo (ISO 16283-1 / ISO 717-1).

    Formula adotada (Figma / EN 12354-1):
        A2 = 0,16 * V2 / T2
        L2 = L1 + 10*log10(T2/T1) + R - 10*log10(S/A2)
        DnT = (L1 - L2) + 10*log10(T2/T0)

    Entradas:
        area_elemento          (S)  - area do elemento separador (m2)
        volume_receptor        (V2) - volume do ambiente receptor (m3)
        reverberacao           (T2) - tempo de reverberacao do RECEPTOR (s)
        reverberacao_emissor   (T1) - tempo de reverberacao do EMISSOR (s);
                                      se ausente, assume T1 = T2 (fator de normalizacao neutro)
        reducao_sonora         (R)  - indice de reducao sonora do material (dB)
        l1                          - nivel de pressao sonora na fonte (dB)

    Saidas:
        L2  - nivel previsto no receptor (indicador principal pelo Figma)
        DnT - diferenca normalizada (adicional)
        R'  - indice de reducao sonora aparente (derivado)
    """
    S  = dados.get('area_elemento')
    V2 = dados.get('volume_receptor')
    T2 = dados.get('reverberacao')            # receptor
    R  = dados.get('reducao_sonora')
    L1 = dados.get('l1')

    _validar_positivo([
        ('area_elemento', S),
        ('volume_receptor', V2),
        ('reverberacao', T2),
        ('reducao_sonora', R),
        ('l1', L1),
    ])

    S = float(S); V2 = float(V2); T2 = float(T2); R = float(R); L1 = float(L1)

    T1 = dados.get('reverberacao_emissor')     # emissor (opcional, default = T2)
    if T1 is None or T1 <= 0:
        T1 = float(T2)
    else:
        T1 = float(T1)

    A2 = absorcao_equivalente(V2, T2)                        # 0,16*V2/T2
    L2 = L1 + 10.0 * math.log10(T2 / T1) + R - 10.0 * math.log10(S / A2)   # formula do Figma
    DnT = (L1 - L2) + 10.0 * math.log10(T2 / T0)            # padronizado
    R_aparente = L1 - L2 + 10.0 * math.log10(S / A2)        # "R aparente" derivado

    return {
        'tipo': 'aereo',
        'areas': {'absorcao_equivalente': round(A2, 4)},
        'indicador_principal': {
            'nome': 'L2',
            'descricao': 'Nivel de pressao sonora previsto no ambiente receptor',
            'valor': round(L2, 4),
            'unidade': 'dB',
        },
        'indicador_secundario': {
            'nome': "R'",
            'descricao': 'Indice de reducao sonora aparente',
            'valor': round(R_aparente, 4),
            'unidade': 'dB',
        },
        'detalhes': {
            'l2_previsto': round(L2, 4),
            'dnt': round(DnT, 4),
            'absorcao_equivalente': round(A2, 4),
        },
    }


def calcular_tipo_impacto(dados):
    """
    Nivel de pressao sonora de impacto (ISO 16283-2 / ISO 717-2).

    Entradas:
        area_elemento   (S)  - area do elemento (m2)
        volume_receptor (V)  - volume do ambiente receptor (m3)
        reverberacao    (T)  - tempo de reverberacao (s)
        nivel_impacto (L2n)  - nivel medido no receptor (dB)

    Saidas:
        L'n  - nivel normalizado pela absorcao (A0)
        L'nT - nivel normalizado pela reverberacao (T0) -> indicador principal
    """
    S   = dados.get('area_elemento')
    V   = dados.get('volume_receptor')
    T   = dados.get('reverberacao')
    L2n = dados.get('nivel_impacto')

    _validar_positivo([
        ('area_elemento', S),
        ('volume_receptor', V),
        ('reverberacao', T),
        ('nivel_impacto', L2n),
    ])

    S = float(S); V = float(V); T = float(T); L2n = float(L2n)

    A   = absorcao_equivalente(V, T)
    Ln  = L2n + 10.0 * math.log10(A / A0)   # L'n normalizado pela absorcao
    LnT = L2n + 10.0 * math.log10(T / T0)   # L'nT padronizado pela reverba.

    return {
        'tipo': 'impacto',
        'areas': {'absorcao_equivalente': round(A, 4)},
        'indicador_principal': {
            'nome': "L'nT",
            'descricao': 'Nivel normalizado de impacto (padronizado)',
            'valor': round(LnT, 4),
            'unidade': 'dB',
        },
        'indicador_secundario': {
            'nome': "L'n",
            'descricao': 'Nivel normalizado de impacto',
            'valor': round(Ln, 4),
            'unidade': 'dB',
        },
        'detalhes': {
            'absorcao_equivalente': round(A, 4),
        },
    }


def calcular(dados):
    """Orquestrador publico: escolhe motor por tipo_analise."""
    tipo = dados.get('tipo_analise', 'aereo')
    if tipo == 'impacto':
        return calcular_tipo_impacto(dados)
    return calcular_tipo_aereo(dados)