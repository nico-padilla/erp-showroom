from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime, timezone

from app.database import Base


def fecha_actual_utc():
    return datetime.now(timezone.utc)


class MovimientoCaja(Base):
    __tablename__ = "movimientos_caja"

    id = Column(Integer, primary_key=True, index=True)

    tipo = Column(String)  # ingreso / gasto
    concepto = Column(String)

    monto = Column(Float)

    fecha = Column(DateTime, default=fecha_actual_utc)
