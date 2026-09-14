import models
from acustica import router as acustica_router
from catalogo import router as catalogo_router
from database import engine
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import router

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AcousticBuild API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(acustica_router)
app.include_router(catalogo_router)

@app.get("/")
def root():
    return {"message": "AcousticBuild API está no ar."}
