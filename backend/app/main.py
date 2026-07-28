from fastapi import FastAPI

from app.database import Base, engine

from app.routes.productos import router as productos_router
from app.routes.clientes import router as clientes_router
from app.routes.ventas import router as ventas_router
# Importar modelos para crear tablas
from app.models import producto
from app.models import cliente
from app.models import venta
from app.models import detalle_venta
# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ERP María Paz Showroom",
    version="1.0"
)

# Registrar rutas
app.include_router(productos_router)
app.include_router(clientes_router)
app.include_router(ventas_router)

@app.get("/")
def inicio():
    return {
        "mensaje": "ERP María Paz Showroom funcionando"
    }
