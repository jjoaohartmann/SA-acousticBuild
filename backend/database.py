import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# Banco em producao (Vercel) vem de variavel de ambiente (ex.: Neon / Vercel Postgres).
# Local / sem config -> SQLite em arquivo (acoust.db), mantendo o dev funcionando.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./acoust.db")

# Vercel/Neon costumam devolver URLs "postgres://"; o SQLAlchemy exige "postgresql://".
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Forca o driver psycopg 3 (declarado no requirements.txt como psycopg[binary]).
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg://", 1)

_is_sqlite = DATABASE_URL.startswith("sqlite")
_connect_args = {"check_same_thread": False} if _is_sqlite else {}

engine = create_engine(
    DATABASE_URL,
    connect_args=_connect_args,
    # pool_pre_ping evita usar conexoes mortas numa funcao serverless/managed Postgres.
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()