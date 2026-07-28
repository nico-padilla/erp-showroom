from sqlalchemy import Column, Integer, String, Float, Boolean
from app.database import Base


class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)

    codigo = Column(String, unique=True, index=True)
    codigo_barras = Column(String, unique=True, nullable=True)

    nombre = Column(String)
    descripcion = Column(String, nullable=True)

    categoria = Column(String)
    marca = Column(String, nullable=True)

    talle = Column(String)
    color = Column(String)

    precio_compra = Column(Float)
    precio_venta = Column(Float)

    stock = Column(Integer, default=0)
    stock_minimo = Column(Integer, default=1)

    imagen = Column(String, nullable=True)

    activo = Column(Boolean, default=True)
