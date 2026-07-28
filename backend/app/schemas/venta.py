from pydantic import BaseModel, ConfigDict
from datetime import datetime


class VentaBase(BaseModel):
    cliente_id: int
    total: float
    metodo_pago: str


class VentaCreate(VentaBase):
    pass


class VentaRespuesta(VentaBase):
    id: int
    fecha: datetime

    model_config = ConfigDict(from_attributes=True)
