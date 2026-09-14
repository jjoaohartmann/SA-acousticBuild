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

# CORS: em producao front e back ficam no mesmo dominio, mas libera-se por env
# quando precessario (origens separadas por virgula). Default mantem o dev local.
_ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
_ALLOWED_ORIGINS_LIST = [o.strip() for o in _ALLOWED_ORIGINS.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_ALLOWED_ORIGINS_LIST,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(acustica_router)

@app.get("/")
def root():
    return {"message": "AcousticBuild API está no ar! 🚀"}