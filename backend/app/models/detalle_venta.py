from sqlalchemy import Column, Integer, Float
from app.database import Base


class DetalleVenta(Base):
    __tablename__ = "detalle_ventas"

    id = Column(Integer, primary_key=True, index=True)

    venta_id = Column(Integer)
    producto_id = Column(Integer)

    cantidad = Column(Integer)
    precio_unitario = Column(Float)
