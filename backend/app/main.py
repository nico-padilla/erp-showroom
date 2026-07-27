from fastapi import FastAPI

from app.database import Base, engine
from app.routes.productos import router as productos_router

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ERP María Paz Showroom",
    version="1.0"
)

# Registrar rutas
app.include_router(productos_router)


@app.get("/")
def inicio():
    return {
        "mensaje": "ERP María Paz Showroom funcionando"
    }