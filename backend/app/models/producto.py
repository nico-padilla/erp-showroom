from sqlalchemy import Column, Integer, String, Float, Boolean
from app.database import Base


class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)

    codigo = Column(String, unique=True, index=True, nullable=False)
    codigo_barras = Column(String, unique=True, nullable=True)

    nombre = Column(String, nullable=False)
    descripcion = Column(String, nullable=True)

    categoria = Column(String, nullable=True)
    marca = Column(String, nullable=True)

    talle = Column(String, nullable=True)
    color = Column(String, nullable=True)

    precio_compra = Column(Float, default=0)
    precio_venta = Column(Float, default=0)

    stock = Column(Integer, default=0)
    stock_minimo = Column(Integer, default=2)

    imagen = Column(String, nullable=True)

    activo = Column(Boolean, default=True)
