from pydantic import BaseModel, ConfigDict


class ProductoBase(BaseModel):
    codigo: str | None = None
    codigo_barras: str | None = None

    nombre: str
    descripcion: str | None = None

    categoria: str | None = None
    marca: str | None = None

    talle: str | None = None
    color: str | None = None

    precio_compra: float = 0
    precio_venta: float = 0

    stock: int = 0
    stock_minimo: int = 2

    imagen: str | None = None
    activo: bool = True


class ProductoCreate(ProductoBase):
    pass


class ProductoUpdate(ProductoBase):
    pass


class ProductoRespuesta(ProductoBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
