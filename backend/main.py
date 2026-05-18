from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import router

#  Cria todas as tabelas no banco ao iniciar (se não exitir)
models.Base.metadata.create.all(bind=engine)

app = FastAPI(
    title = "AcousticBuild API",
    description="API de Autenticação do AcosticBuild",
    version="1.0.0"
)

# CORS - Permite que o front-end (em outra porta) acesse a API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
def root():
    return {"mensagem": "Acoustic API está rodando"}