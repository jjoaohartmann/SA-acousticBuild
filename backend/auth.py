# Autenticação usuario
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

# Chave de segurança, em produção isso viria de uma variavel de ambiente (.env)

SECRET_KEY = "acousticbuild-super-secret-key-truque-em-produção"
ALGORITHM = "HS256"
ACESS_TOKEN_EXPIRE_MINUTES = 60 *24 # token valido por 24h

# contexto de criptografia usando bcrypt (padrão Industria)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Transforma a senha em uma hash irreversivel anres de salvar."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Compara a senha digitada com o hash salvo no banco."""
    return pwd_context.verify(plain_password, hashed_password)

def create_acess_token(data: dict) -> str:
    """Gera um token JWT com prazo de expiração."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)