from sqlalchemy import Column, Integer, Float, String, DateTime
from datetime import datetime
from app.database import Base


class Venta(Base):
    __tablename__ = "ventas"

    id = Column(Integer, primary_key=True, index=True)

    cliente_id = Column(Integer)

    total = Column(Float)

    metodo_pago = Column(String)

    fecha = Column(DateTime, default=datetime.utcnow)

