# rotas de conversação do back com o front
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserCreate, UserLogin, UserResponse, token
from auth import hash_password, verify_password, create_acess_token

router = APIRouter(prefix="/auth", tags=["Autentificação"])

@router.post("/register", response_model=UserResponse, status_code=201)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Cadastrar um novo usuario"""

    #Verifica de o e-mail ja está em uso e envia uma msg
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Este e-mail já esta cadastrado."
        )
    
    # Nunca salva a senhha em texto puro
    hashed = hash_password(user_data.password)
    new_user = User(name=user_data.name, email=user_data.email, password=hashed)

    db.add(new_user)
    db.commit()
    db.refresh(new_user) #atualiza o objeto com o id gerado pelo banco
    return new_user

@router.post("/login", response_model=token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Autentica um usuario e retorna um token JWT."""

    user = db.query(User).filter(User.email == credentials.email).first

    # Mesma mensagem para e-mail invalido E senha errada
    if not user or not verify_password(credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou Senha incorretos."
        )
    
    Token = create_acess_token(data={"sub": user.emil, "user.id": user.id})
    return {"acess_token": token, "token_type": "beare", "user": user}