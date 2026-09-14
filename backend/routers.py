import recuperacao
from auth import create_access_token, get_current_user, hash_password, verify_password
from database import get_db
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from models import User
from schemas import (
    EsqueciSenhaRequest,
    MensagemResponse,
    RedefinirSenhaRequest,
    Token,
    UserCreate,
    UserLogin,
    UserResponse,
    UserUpdate,
)
from sqlalchemy.orm import Session

router = APIRouter(prefix="/auth", tags=["Autenticação"])

MENSAGEM_PEDIDO_ENVIADO = (
    "Se existir uma conta com este e-mail, enviamos um link para redefinir a senha. "
    f"Ele vale por {recuperacao.VALIDADE_MINUTOS} minutos."
)

@router.post("/register", response_model=UserResponse, status_code=201)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Este e-mail já está cadastrado."
        )
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hash_password(user_data.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, str(user.password)):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos."
        )
    token = create_access_token(data={"sub": user.email, "user_id": user.id})
    return {"access_token": token, "token_type": "bearer", "user": user}

@router.get("/me", response_model=UserResponse)
def read_me(user: User = Depends(get_current_user)):
    return user

@router.put("/me", response_model=Token)
def update_me(
    dados: UserUpdate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if dados.email and dados.email != user.email:
        em_uso = db.query(User).filter(User.email == dados.email, User.id != user.id).first()
        if em_uso:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Este e-mail já está cadastrado."
            )
        user.email = dados.email

    if dados.name:
        user.name = dados.name

    if dados.password:
        user.password = hash_password(dados.password)

    db.commit()
    db.refresh(user)

    # o e-mail entra no token, então ele é reemitido para não invalidar a sessão
    token = create_access_token(data={"sub": user.email, "user_id": user.id})
    return {"access_token": token, "token_type": "bearer", "user": user}


@router.post("/esqueci-senha", response_model=MensagemResponse)
def esqueci_senha(
    dados: EsqueciSenhaRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    # Mesma resposta exista ou não a conta — ver recuperacao.py.
    user = db.query(User).filter(User.email == dados.email).first()
    if user is not None:
        token = recuperacao.emitir_token(db, user)
        if token is not None:
            # Em segundo plano: o tempo de resposta não pode denunciar,
            # pela demora do envio, que a conta existe.
            background_tasks.add_task(
                recuperacao.enviar_link, user.email, user.name, recuperacao.montar_link(token)
            )
    return {"detail": MENSAGEM_PEDIDO_ENVIADO}


@router.post("/redefinir-senha", response_model=MensagemResponse)
def redefinir_senha(dados: RedefinirSenhaRequest, db: Session = Depends(get_db)):
    if not recuperacao.redefinir_senha(db, dados.token, dados.nova_senha):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este link é inválido ou expirou. Peça um novo.",
        )
    return {"detail": "Senha redefinida. Você já pode entrar com a nova senha."}