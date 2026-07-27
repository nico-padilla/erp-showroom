from sqlalchemy import Column, Integer, String, Float
from app.database import Base


class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String, unique=True, index=True)
    nombre = Column(String)
    categoria = Column(String)
    talle = Column(String)
    color = Column(String)
    precio_compra = Column(Float)
    precio_venta = Column(Float)
    stock = Column(Integer, default=0)
    