"""Recuperação de senha por link de uso único.

Regras de segurança, todas deliberadas:

- A resposta do pedido é sempre a mesma, exista ou não a conta. Sem isso, o
  formulário vira uma forma de descobrir quais e-mails estão cadastrados.
- O token nunca volta na resposta HTTP. Se voltasse, bastaria saber o e-mail
  de alguém para trocar a senha dessa pessoa.
- Só o hash SHA-256 do token vai para o banco.
- O link vale 30 minutos, serve uma única vez, e pedir um novo invalida os
  anteriores. Trocar a senha invalida todos os links pendentes da conta.
- No máximo 3 pedidos por conta a cada 15 minutos; o excedente é ignorado em
  silêncio (a resposta continua igual).

Entrega do link: por e-mail, quando as variáveis SMTP_* estão configuradas.
Sem elas (desenvolvimento local), o link é impresso no terminal do back-end.
"""
from __future__ import annotations

import hashlib
import os
import secrets
import smtplib
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage

from auth import hash_password
from models import TokenRedefinicaoSenha, User
from sqlalchemy.orm import Session

VALIDADE_MINUTOS = 30
MAX_PEDIDOS_POR_JANELA = 3
JANELA_MINUTOS = 15

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")


def _agora() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


def _hash(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def montar_link(token: str) -> str:
    return f"{FRONTEND_URL}/redefinir-senha?token={token}"


def emitir_token(db: Session, user: User) -> str | None:
    """Cria um link novo para a conta. Devolve None se o limite de pedidos estourou."""
    agora = _agora()
    janela = agora - timedelta(minutes=JANELA_MINUTOS)

    recentes = (
        db.query(TokenRedefinicaoSenha)
        .filter(
            TokenRedefinicaoSenha.user_id == user.id,
            TokenRedefinicaoSenha.criado_em >= janela,
        )
        .count()
    )
    if recentes >= MAX_PEDIDOS_POR_JANELA:
        return None

    # Só o link mais recente vale: os pendentes são marcados como usados.
    db.query(TokenRedefinicaoSenha).filter(
        TokenRedefinicaoSenha.user_id == user.id,
        TokenRedefinicaoSenha.usado_em.is_(None),
    ).update({TokenRedefinicaoSenha.usado_em: agora}, synchronize_session=False)

    token = secrets.token_urlsafe(32)
    db.add(TokenRedefinicaoSenha(
        user_id=user.id,
        token_hash=_hash(token),
        criado_em=agora,
        expira_em=agora + timedelta(minutes=VALIDADE_MINUTOS),
    ))
    db.commit()
    return token


def redefinir_senha(db: Session, token: str, nova_senha: str) -> bool:
    """Troca a senha se o token for válido. False para qualquer falha, sem detalhar qual."""
    agora = _agora()
    registro = (
        db.query(TokenRedefinicaoSenha)
        .filter(TokenRedefinicaoSenha.token_hash == _hash(token))
        .first()
    )
    if registro is None or registro.usado_em is not None or registro.expira_em < agora:
        return False

    # Marca como usado de forma condicional: se duas requisições chegarem com o
    # mesmo link ao mesmo tempo, só uma consegue.
    marcados = (
        db.query(TokenRedefinicaoSenha)
        .filter(
            TokenRedefinicaoSenha.id == registro.id,
            TokenRedefinicaoSenha.usado_em.is_(None),
        )
        .update({TokenRedefinicaoSenha.usado_em: agora}, synchronize_session=False)
    )
    if marcados != 1:
        db.rollback()
        return False

    user = db.get(User, registro.user_id)
    if user is None:
        db.rollback()
        return False

    user.password = hash_password(nova_senha)

    # Qualquer outro link pendente da conta deixa de valer.
    db.query(TokenRedefinicaoSenha).filter(
        TokenRedefinicaoSenha.user_id == user.id,
        TokenRedefinicaoSenha.usado_em.is_(None),
    ).update({TokenRedefinicaoSenha.usado_em: agora}, synchronize_session=False)

    db.commit()
    return True


def enviar_link(email_destino: str, nome: str, link: str) -> None:
    """Entrega o link. Roda em segundo plano, depois da resposta já enviada."""
    host = os.getenv("SMTP_HOST")
    if not host:
        # Sem acentos de propósito: o terminal do Windows embaralha UTF-8
        # ("RECUPERA��O") e esta é justamente a mensagem que precisa ser lida.
        print(
            "\n" + "=" * 72 +
            "\n  RECUPERACAO DE SENHA - modo desenvolvimento (SMTP nao configurado)"
            f"\n  Para: {email_destino}"
            f"\n  Link (vale {VALIDADE_MINUTOS} min, uso unico):"
            f"\n  {link}\n" + "=" * 72 + "\n",
            flush=True,
        )
        return

    remetente = os.getenv("SMTP_FROM") or os.getenv("SMTP_USER") or "nao-responda@acousticbuild"
    primeiro_nome = (nome or "").split(" ")[0] or "olá"

    msg = EmailMessage()
    msg["Subject"] = "AcousticBuild — redefinição de senha"
    msg["From"] = remetente
    msg["To"] = email_destino
    msg.set_content(
        f"Oi, {primeiro_nome}.\n\n"
        "Recebemos um pedido para redefinir a senha da sua conta na AcousticBuild.\n"
        "Para criar uma nova senha, abra o link abaixo:\n\n"
        f"{link}\n\n"
        f"O link vale por {VALIDADE_MINUTOS} minutos e só pode ser usado uma vez.\n"
        "Se não foi você que pediu, ignore este e-mail: sua senha continua a mesma.\n"
    )

    try:
        with smtplib.SMTP(host, int(os.getenv("SMTP_PORT", "587")), timeout=10) as smtp:
            smtp.starttls()
            usuario = os.getenv("SMTP_USER")
            if usuario:
                smtp.login(usuario, os.getenv("SMTP_PASSWORD", ""))
            smtp.send_message(msg)
    except (OSError, smtplib.SMTPException) as erro:
        # A falha fica no log do servidor; quem pediu recebe a mesma resposta de
        # sempre, para o erro não revelar se a conta existe.
        print(f"[recuperacao] falha ao enviar e-mail para {email_destino}: {erro}", flush=True)
