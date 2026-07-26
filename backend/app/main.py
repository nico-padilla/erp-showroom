from fastapi import FastAPI

from app.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ERP María Paz Showroom",
    version="0.1.0"
)


@app.get("/")
def inicio():
    return {
        "mensaje": "Bienvenido al ERP María Paz Showroom",
        "estado": "Sistema funcionando",
        "base_datos": "Conectada"
    }