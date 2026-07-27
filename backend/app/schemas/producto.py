from pydantic import BaseModel, ConfigDict


class ProductoBase(BaseModel):
    codigo: str
    nombre: str
    categoria: str
    talle: str
    color: str
    precio_compra: float
    precio_venta: float
    stock: int


class ProductoCreate(ProductoBase):
    pass


class ProductoRespuesta(ProductoBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

