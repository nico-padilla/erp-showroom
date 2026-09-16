import os
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker

# ==========================================
# CONFIGURACIÓN DE BASE DE DATOS
# ==========================================

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Parche crítico para Render: reemplaza el prefijo obsoleto
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

    # Despliegue Cloud (PostgreSQL)
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True
    )

else:
    # Desarrollo local (SQLite)
    DATABASE_URL = "sqlite:///./erp_showroom.db"

    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )

# ==========================================
# BASE Y SESIONES
# ==========================================

Base = declarative_base()


def normalizar_nombres_tablas():
    """Unifica nombres legacy creados con mayúsculas en PostgreSQL."""
    if engine.dialect.name != "postgresql":
        return

    nombres_esperados = {
        "Productos": "productos",
        "Clientes": "clientes",
        "Movimientos_stock": "movimientos_stock",
        "Movimientos_caja": "movimientos_caja",
        "Ventas": "ventas",
        "Detalle_ventas": "detalle_ventas",
    }

    tablas_existentes = set(inspect(engine).get_table_names())

    with engine.begin() as conexion:
        for nombre_actual, nombre_normalizado in nombres_esperados.items():
            if (
                nombre_actual in tablas_existentes
                and nombre_normalizado not in tablas_existentes
            ):
                conexion.execute(
                    text(
                        f'ALTER TABLE "{nombre_actual}" '
                        f'RENAME TO {nombre_normalizado}'
                    )
                )

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# ==========================================
# DEPENDENCIA PARA FASTAPI
# ==========================================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()