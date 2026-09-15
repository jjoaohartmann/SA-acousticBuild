import os
from datetime import datetime, timedelta, timezone

from database import get_db
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from models import User
from passlib.context import CryptContext
from sqlalchemy.orm import Session

# O repositório é público: com a chave fixa no código, qualquer pessoa consegue
# assinar um token de login válido para qualquer conta. Em produção a chave TEM
# que vir do ambiente; o valor abaixo só existe para o desenvolvimento local.
SECRET_KEY = os.getenv("SECRET_KEY", "acousticbuild-chave-apenas-desenvolvimento")  # noqa: S105
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# Bearer token - mesmo esquema usado pelo frontend (Authorization: Bearer <token>)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id_raw = payload.get("user_id")
        if user_id_raw is None:
            raise credentials_exception
        user_id = int(user_id_raw)
    except JWTError as e:
        raise credentials_exception from e

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user