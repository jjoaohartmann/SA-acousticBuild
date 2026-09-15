import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import router
from acustica import router as acustica_router

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AcousticBuild API",
    version="1.0.0"
)

# CORS — o backend (Render) fica em dominio diferente do frontend (Vercel).
# Se ALLOWED_ORIGINS for informado, usa a lista (virgula) com allow_credentials=True.
# Sem env: libera qualquer origem. Como a autenticacao usa header Authorization
# (Bearer token, sem cookies), "*" + allow_credentials=False e seguro p/ este projeto.
_ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "").strip()
if _ALLOWED_ORIGINS:
    _ORIGINS = [o.strip() for o in _ALLOWED_ORIGINS.split(",") if o.strip()]
    _CREDENTIALS = True
else:
    _ORIGINS = ["*"]
    _CREDENTIALS = False

app.add_middleware(
    CORSMiddleware,
    allow_origins=_ORIGINS,
    allow_credentials=_CREDENTIALS,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(acustica_router)

@app.get("/")
def root():
    return {"message": "AcousticBuild API está no ar! 🚀"}