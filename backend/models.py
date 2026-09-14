from database import Base
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


class User(Base):
    __tablename__ = "users"

    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String, nullable=False)
    email      = Column(String, unique=True, index=True, nullable=False)
    password   = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    simulacoes = relationship("Simulacao", back_populates="user", cascade="all, delete-orphan")
    tokens_redefinicao = relationship("TokenRedefinicaoSenha", cascade="all, delete-orphan")


class TokenRedefinicaoSenha(Base):
    """Link de "esqueci minha senha": uso único e com validade curta.

    Só o hash SHA-256 do token é gravado. Quem tiver acesso ao banco não
    consegue montar um link válido a partir desta tabela.
    Datas em UTC sem fuso (o SQLite não guarda o fuso de forma confiável).
    """
    __tablename__ = "tokens_redefinicao_senha"

    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    token_hash = Column(String(64), unique=True, index=True, nullable=False)
    criado_em  = Column(DateTime, nullable=False)
    expira_em  = Column(DateTime, nullable=False)
    usado_em   = Column(DateTime, nullable=True)   # também marca links invalidados


class Simulacao(Base):
    __tablename__ = "simulacoes"

    id            = Column(Integer, primary_key=True, index=True)
    user_id       = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    tipo_analise  = Column(String, nullable=False)
    dados_entrada = Column(Text, nullable=False)      # JSON string dos dados de entrada
    resultado     = Column(Text, nullable=False)      # JSON string do resultado
    criado_em     = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="simulacoes")


# ==========================================
# FASE 1: BANCO DE DADOS RELACIONAL ACÚSTICO
# ==========================================

class Material(Base):
    """Componente individual físico com propriedades materiais comprovadas por fonte técnica."""
    __tablename__ = "materiais"

    id                = Column(Integer, primary_key=True, index=True)
    nome              = Column(String, nullable=False)
    categoria         = Column(String, nullable=False)  # "alvenaria", "revestimento", "concreto", "sistema_leve", "piso", "isolamento"
    subcategoria      = Column(String, nullable=True)
    densidade         = Column(Float, nullable=True)    # kg/m³
    unidade_densidade = Column(String, default="kg/m³")
    descricao         = Column(Text, nullable=True)
    fonte             = Column(String, nullable=True)   # Ex: ABNT NBR 15220-2, ficha técnica
    fabricante        = Column(String, nullable=True)
    produto           = Column(String, nullable=True)

    variacoes = relationship("VariacaoMaterial", back_populates="material", cascade="all, delete-orphan")


class VariacaoMaterial(Base):
    """Variação dimensional de um material (espessura nominal, dimensões, massa superficial específica)."""
    __tablename__ = "variacoes_material"

    id                   = Column(Integer, primary_key=True, index=True)
    material_id          = Column(Integer, ForeignKey("materiais.id"), nullable=False)
    nome_variacao        = Column(String, nullable=False)  # Ex: "14 cm", "1,5 cm", "12,5 mm"
    espessura            = Column(Float, nullable=True)    # metros (ex: 0.14)
    unidade_espessura    = Column(String, default="m")
    massa_superficial    = Column(Float, nullable=True)    # kg/m² quando documentada diretamente
    dimensao_comprimento = Column(Float, nullable=True)    # metros
    dimensao_altura      = Column(Float, nullable=True)    # metros
    descricao            = Column(Text, nullable=True)
    fonte                = Column(String, nullable=True)

    material = relationship("Material", back_populates="variacoes")


class SistemaConstrutivo(Base):
    """Sistema construtivo completo (composição de camadas físicas e dados acústicos)."""
    __tablename__ = "sistemas_construtivos"

    id                      = Column(Integer, primary_key=True, index=True)
    codigo                  = Column(String, unique=True, index=True, nullable=False)  # Ex: "PAR-CER-014"
    nome                    = Column(String, nullable=False)
    tipo_elemento           = Column(String, nullable=False)  # "parede" | "piso_laje"
    descricao               = Column(Text, nullable=True)
    espessura_total         = Column(Float, nullable=True)    # metros
    massa_superficial_total = Column(Float, nullable=True)    # kg/m²

    camadas         = relationship("CamadaSistema", back_populates="sistema", order_by="CamadaSistema.ordem", cascade="all, delete-orphan")
    dados_acusticos = relationship("DadoAcustico", back_populates="sistema", cascade="all, delete-orphan")


class CamadaSistema(Base):
    """Estrato ou camada componente de um sistema construtivo."""
    __tablename__ = "camadas_sistema"

    id          = Column(Integer, primary_key=True, index=True)
    sistema_id  = Column(Integer, ForeignKey("sistemas_construtivos.id"), nullable=False)
    material_id = Column(Integer, ForeignKey("materiais.id"), nullable=False)
    variacao_id = Column(Integer, ForeignKey("variacoes_material.id"), nullable=True)
    ordem       = Column(Integer, nullable=False)  # 1, 2, 3...
    espessura   = Column(Float, nullable=True)     # metros
    posicao     = Column(String, nullable=True)    # "face_interna", "nucleo", "revestimento_ext", etc.

    sistema  = relationship("SistemaConstrutivo", back_populates="camadas")
    material = relationship("Material")
    variacao = relationship("VariacaoMaterial")


class DadoAcustico(Base):
    """Desempenho acústico documentado de um sistema, com fonte e norma de ensaio obrigatórias."""
    __tablename__ = "dados_acusticos"

    id               = Column(Integer, primary_key=True, index=True)
    sistema_id       = Column(Integer, ForeignKey("sistemas_construtivos.id"), nullable=False)
    tipo_ruido       = Column(String, nullable=False)  # "aereo" | "impacto"
    r                = Column(Float, nullable=True)    # Redução sonora R pontual [dB]
    rw               = Column(Float, nullable=True)    # Índice ponderado Rw [dB]
    ln               = Column(Float, nullable=True)    # Nível de impacto Ln pontual [dB]
    ln_w             = Column(Float, nullable=True)    # Nível de impacto ponderado laboratório Ln,w [dB]
    l_nt_w           = Column(Float, nullable=True)    # Nível de impacto campo L'nT,w [dB]
    delta_lw         = Column(Float, nullable=True)    # Redução atenuada do impacto ΔLw [dB]
    rigidez_dinamica = Column(Float, nullable=True)    # Rigidez dinâmica s' [MN/m³]
    norma_ensaio     = Column(String, nullable=True)   # Ex: "ABNT NBR ISO 10140-2 / ISO 717-1"
    condicao_ensaio  = Column(Text, nullable=True)     # Ex: "Ensaio laboratorial sem transmissão marginal"
    confiabilidade   = Column(String, default="documentado")  # "documentado" | "ensaio_laboratorio" | "ensaio_campo"
    fonte            = Column(String, nullable=False)  # OBRIGATÓRIA: Relatório IPT nº..., Catálogo ProAcústica...

    sistema     = relationship("SistemaConstrutivo", back_populates="dados_acusticos")
    frequencias = relationship("DadoFrequencia", back_populates="dado_acustico", cascade="all, delete-orphan")


class DadoFrequencia(Base):
    """Valores de isolamento ou impacto por terço de oitava (100 Hz a 3150 Hz)."""
    __tablename__ = "dados_frequencia"

    id               = Column(Integer, primary_key=True, index=True)
    dado_acustico_id = Column(Integer, ForeignKey("dados_acusticos.id"), nullable=False)
    frequencia       = Column(Integer, nullable=False)  # 100, 125, 160, 200, 250, 315, 400, ..., 3150
    valor            = Column(Float, nullable=False)    # dB
    unidade          = Column(String, default="dB")

    dado_acustico = relationship("DadoAcustico", back_populates="frequencias")