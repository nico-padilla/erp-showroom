from pydantic import BaseModel
from datetime import datetime


class ProductoStockRespuesta(BaseModel):
    id: int
    nombre: str

    class Config:
        from_attributes = True



class MovimientoStockCreate(BaseModel):
    producto_id: int
    cantidad: int
    motivo: str



class MovimientoStockRespuesta(BaseModel):
    id: int
    producto_id: int
    tipo: str
    cantidad: int
    motivo: str
    fecha: datetime
    producto: ProductoStockRespuesta | None = None

    class Config:
        from_attributes = True
