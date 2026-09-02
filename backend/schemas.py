from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, Any, Dict, List

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}  # sintaxe Pydantic v2

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# ==========================================================
# Calculadora Acustica
# ==========================================================

class CalcularRequest(BaseModel):
    tipo_analise: str = "aereo"          # 'aereo' | 'impacto'
    area_elemento: Optional[float] = None       # S (m2)
    volume_receptor: Optional[float] = None     # V (m3)
    reverberacao: Optional[float] = None        # T2 do receptor (s)
    reverberacao_emissor: Optional[float] = None  # T1 do emissor (s) — aereo
    reducao_sonora: Optional[float] = None      # R do material (dB) — isolamento aereo
    l1: Optional[float] = None                  # nivel na fonte (dB) — isolamento aereo
    nivel_impacto: Optional[float] = None       # L2n medido no receptor (dB) — impacto


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
    indicador_principal: Indicador
    indicador_secundario: Optional[Indicador] = None
    classificacao: str
    motivo: str
    sugestoes: List[Sugestao]
    detalhes: Dict[str, Any] = {}


class SimulacaoCreate(BaseModel):
    tipo_analise: str
    dados_entrada: Dict[str, Any]
    resultado: Dict[str, Any]


class SimulacaoResponse(BaseModel):
    id: int
    tipo_analise: str
    dados_entrada: Dict[str, Any]
    resultado: Dict[str, Any]
    criado_em: datetime

    model_config = {"from_attributes": True}