from pydantic import BaseModel, ConfigDict


class DetalleVentaBase(BaseModel):
    producto_id: int
    cantidad: int
    precio_unitario: float


class DetalleVentaCreate(DetalleVentaBase):
    pass


class DetalleVentaRespuesta(DetalleVentaBase):
    id: int
    venta_id: int

    model_config = ConfigDict(from_attributes=True)
