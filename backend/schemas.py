from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    # mesma regra do PUT /auth/me e do formulário — a API aceitava senha de 1 caractere
    password: str = Field(min_length=6, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=120)
    email: EmailStr | None = None
    password: str | None = Field(default=None, min_length=6, max_length=128)


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class EsqueciSenhaRequest(BaseModel):
    email: EmailStr


class RedefinirSenhaRequest(BaseModel):
    token: str = Field(min_length=20, max_length=200)
    # mesma regra do cadastro e do PUT /auth/me
    nova_senha: str = Field(min_length=6, max_length=128)


class MensagemResponse(BaseModel):
    detail: str


# ==========================================================
# Catálogo de Materiais e Sistemas Construtivos
# ==========================================================

class VariacaoOut(BaseModel):
    id: int
    nome_variacao: str
    espessura: float | None = None
    unidade_espessura: str = "m"
    massa_superficial: float | None = None
    dimensao_comprimento: float | None = None
    dimensao_altura: float | None = None
    descricao: str | None = None
    fonte: str | None = None

    model_config = ConfigDict(from_attributes=True)


class MaterialOut(BaseModel):
    id: int
    nome: str
    categoria: str
    subcategoria: str | None = None
    densidade: float | None = None
    unidade_densidade: str = "kg/m³"
    descricao: str | None = None
    fonte: str | None = None
    fabricante: str | None = None
    produto: str | None = None
    variacoes: list[VariacaoOut] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class DadoAcusticoOut(BaseModel):
    id: int
    tipo_ruido: str
    r: float | None = None
    rw: float | None = None
    ln: float | None = None
    ln_w: float | None = None
    l_nt_w: float | None = None
    delta_lw: float | None = None
    rigidez_dinamica: float | None = None
    norma_ensaio: str | None = None
    condicao_ensaio: str | None = None
    confiabilidade: str = "documentado"
    fonte: str

    model_config = ConfigDict(from_attributes=True)


class CamadaOut(BaseModel):
    id: int
    ordem: int
    material_id: int
    variacao_id: int | None = None
    material_nome: str | None = None
    espessura: float | None = None
    espessura_cm: float | None = None
    posicao: str | None = None

    model_config = ConfigDict(from_attributes=True)


class SistemaOut(BaseModel):
    id: int
    codigo: str
    nome: str
    tipo_elemento: str
    descricao: str | None = None
    espessura_total: float | None = None
    massa_superficial_total: float | None = None
    camadas: list[CamadaOut] = Field(default_factory=list)
    dados_acusticos: list[DadoAcusticoOut] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class CamadaMontagemInput(BaseModel):
    material_id: int | None = None
    variacao_id: int | None = None
    material_nome: str | None = None
    espessura: float | None = None
    espessura_cm: float | None = None
    posicao: str | None = None


class MontarSistemaRequest(BaseModel):
    camadas: list[CamadaMontagemInput] = Field(default_factory=list)


# ==========================================================
# Calculadora Acústica
# ==========================================================

class CalcularRequest(BaseModel):
    tipo_analise: str = "aereo"                   # 'aereo' | 'impacto'
    cenario: str | None = None                    # ID do cenário parametrizado NBR 15575
    ambiente_emissor: str | None = None           # Nome/identificação do emissor
    ambiente_receptor: str | None = None          # Nome/identificação do receptor
    ambiente_receptor_tipo: str | None = None     # Tipo p/ conforto NBR 10152 (eixo independente)
    elemento_separador: str | None = None         # Tipo/material do elemento separador
    area_elemento: float | None = None            # S (m²)
    volume_receptor: float | None = None          # V (m³)
    reverberacao: float | None = None             # T do receptor (s)
    reverberacao_emissor: float | None = None     # T1 do emissor (s)
    reducao_sonora: float | None = None           # R informado pelo usuário (dB)
    l1: float | None = None                       # Nível na fonte (dB)
    l2: float | None = None                       # Nível medido no receptor (dB)
    nivel_impacto: float | None = None            # Li medido no receptor (dB)
    li: float | None = None                       # Alias para nivel_impacto
    sistema_codigo: str | None = None             # Ex: "PAR-CER-014"
    sistema_id: int | None = None                 # ID do sistema construtivo
    camadas: list[dict[str, Any]] | None = None   # Camadas da composição personalizada


class Indicador(BaseModel):
    nome: str
    descricao: str
    valor: float
    unidade: str


class Sugestao(BaseModel):
    recomendacao: str
    motivo: str


class RespostaCalculo(BaseModel):
    tipo: str
    indicador_principal: Indicador | None = None
    indicador_secundario: Indicador | None = None
    classificacao: str
    nivel: str | None = None
    motivo: str
    sugestoes: list[Sugestao] = Field(default_factory=list)
    detalhes: dict[str, Any] = Field(default_factory=dict)
    confiabilidade: str | None = None
    origem: str | None = None
    fontes: list[str] = Field(default_factory=list)
    limitacoes: list[str] = Field(default_factory=list)


class SimulacaoCreate(BaseModel):
    tipo_analise: str
    dados_entrada: dict[str, Any]
    resultado: dict[str, Any]


class SimulacaoResponse(BaseModel):
    id: int
    tipo_analise: str
    dados_entrada: dict[str, Any]
    resultado: dict[str, Any]
    criado_em: datetime

    model_config = ConfigDict(from_attributes=True)