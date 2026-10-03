from pydantic import BaseModel


class ProductoDatosImportacion(BaseModel):
    nombre: str
    categoria: str | None = None
    marca: str | None = None
    talle: str | None = None
    color: str | None = None
    precio_compra: float = 0
    precio_venta: float = 0
