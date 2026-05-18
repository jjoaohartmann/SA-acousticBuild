from pydantic import BaseModel, EmailStr
from datetime import datetime

# Dados nescessarios para cadastrar um novo usuario
class UserCreate(BaseModel):
    name: str 
    Email: EmailStr
    password: str

#  Dados Nescessarios para fazer login
class UserLogin(BaseModel):
    Email: EmailStr
    password: str

# O qye a Api devolve sobre um usuário (sem a senha)
class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    creared_at: datetime

    class config:
        from_attributes = True # Permite converter Model do SQLalchemu -> Shema

# O token que a API retorna após o login bem-sucedido
class token(BaseModel):
    acesse_token: str
    token_tipe: str
    user: UserResponse