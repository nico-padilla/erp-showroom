import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


# ==========================================
# CONFIGURACIÓN DE BASE DE DATOS
# ==========================================

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Render/PostgreSQL
    if DATABASE_URL.startswith("postgresql://"):
        DATABASE_URL = DATABASE_URL.replace(
            "postgresql://",
            "postgresql+psycopg2://",
            1
        )

    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True
    )

else:
    # Desarrollo local
    DATABASE_URL = "sqlite:///./erp_showroom.db"

    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )


# ==========================================
# BASE Y SESIONES
# ==========================================

Base = declarative_base()

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
