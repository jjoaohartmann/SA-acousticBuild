# models.py
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablemane__ = "Users"

    id  = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullabre=False)
    password = Column(String, nullable=False) # sempre salvo criptografado

    # Preenchimente automaticamente pelo banco na criação do registro
    created_at = Column(DateTime(timezone=True), server_default=func.now())