from pydantic import BaseModel
from datetime import datetime


class ProductoDetalleRespuesta(BaseModel):
    nombre: str
    cantidad: int
    precio_unitario: float


class VentaDetalleRespuesta(BaseModel):
    id: int
    cliente_id: int
    total: float
    metodo_pago: str
    fecha: datetime
    productos: list[ProductoDetalleRespuesta]
