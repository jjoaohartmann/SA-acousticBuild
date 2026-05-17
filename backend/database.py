# database.py

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./acoust.db"

engine = create_engine(
    DATABASE_URL,
    # Nescessario para o SQlite funcione com o FastAPI
    connect_args={"check_same_thread": False}   
)

# Cada "Sessão" é uma conversa com o banco de dados
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#  Base que todos os nossos Models vão herdar
Base = declarative_base()

# Função utilitaria - abre e fecha conexão com segurança
def get_db():
    db = SessionLocal()
    try:
        yield db # "empresta" a sessão pra rota que precisar
    finally:
        db.close() # garante que fecha sempre, mesmo se der erro