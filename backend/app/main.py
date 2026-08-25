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
# Permitimos el frontend de producción y los entornos locales.
# También dejamos una expresión para cualquier subdominio *.onrender.com
# que pueda utilizarse para el frontend del ERP.

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
                "http://localhost:5175",
        "http://127.0.0.1:5175",
        "http://localhost:5177",
        "http://127.0.0.1:5177",
        "https://erp-showroom-1.onrender.com",
        "https://erp-showroom.onrender.com",
    ],
    allow_origin_regex=r"https://.*\.onrender\.com$",
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
def root():
    return {
        "mensaje": "ERP Showroom María Paz funcionando",
        "estado": "ok"
    }
