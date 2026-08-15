from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from app.database import Base


def fecha_actual_utc():
    return datetime.now(timezone.utc)


class MovimientoStock(Base):
    __tablename__ = "movimientos_stock"

    id = Column(Integer, primary_key=True, index=True)

    producto_id = Column(
        Integer,
        ForeignKey("productos.id")
    )

    tipo = Column(
        String,
        nullable=False
    )  # entrada / salida

    cantidad = Column(
        Integer,
        nullable=False
    )

    motivo = Column(
        String,
        nullable=True
    )

    fecha = Column(
        DateTime,
        default=fecha_actual_utc
    )

    producto = relationship(
        "Producto"
    )
