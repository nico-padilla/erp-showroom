from pydantic import BaseModel, ConfigDict


class ProductoBase(BaseModel):
    codigo: str | None = None
    codigo_barras: str | None = None

    nombre: str
    descripcion: str | None = None

    categoria: str
    marca: str | None = None

    talle: str
    color: str

    precio_compra: float
    precio_venta: float

    stock: int = 0
    stock_minimo: int = 1

    imagen: str | None = None

    activo: bool = True


class ProductoCreate(ProductoBase):
    pass


class ProductoRespuesta(ProductoBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
