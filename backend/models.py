from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String, nullable=False)
    email      = Column(String, unique=True, index=True, nullable=False)
    password   = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    simulacoes = relationship("Simulacao", back_populates="user", cascade="all, delete-orphan")


class Simulacao(Base):
    __tablename__ = "simulacoes"

    id            = Column(Integer, primary_key=True, index=True)
    user_id       = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    tipo_analise  = Column(String, nullable=False)
    dados_entrada = Column(Text, nullable=False)      # JSON string dos dados de entrada
    resultado     = Column(Text, nullable=False)      # JSON string do resultado
    criado_em     = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="simulacoes")