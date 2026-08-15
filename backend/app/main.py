from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

# ==========================
# RUTAS
# ==========================

from app.routes.productos import router as productos_router
from app.routes.clientes import router as clientes_router
from app.routes.ventas import router as ventas_router
from app.routes.stock import router as stock_router
from app.routes.caja import router as caja_router


# ==========================
# MODELOS
# ==========================

from app.models import producto
from app.models import cliente
from app.models import venta
from app.models import detalle_venta
from app.models import stock
from app.models import caja


# ==========================
# CREAR TABLAS
# ==========================

Base.metadata.create_all(bind=engine)


# ==========================
# APLICACIÓN
# ==========================

app = FastAPI(
    title="ERP Showroom María Paz",
    version="0.1.0"
)


# ==========================
# CORS
# ==========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================
# RUTAS
# ==========================

app.include_router(productos_router)
app.include_router(clientes_router)
app.include_router(ventas_router)
app.include_router(stock_router)
app.include_router(caja_router)


# ==========================
# INICIO
# ==========================

@app.get("/")
def inicio():
    return {
        "mensaje": "ERP Showroom María Paz funcionando"
    }
