"""Formatação numérica para leitura em português.

O separador decimal em pt-BR é a vírgula. Sem isso o mesmo relatório mostrava
"38,9 dB" em um card e "38.85 dB" no parágrafo logo abaixo.
"""


def num(valor: float | int | None, casas: int = 1) -> str:
    """Número formatado com vírgula decimal. `None` vira travessão."""
    if valor is None:
        return '—'
    return f'{float(valor):.{casas}f}'.replace('.', ',')
