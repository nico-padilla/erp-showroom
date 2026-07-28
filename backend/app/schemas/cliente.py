from pydantic import BaseModel, ConfigDict


class ClienteBase(BaseModel):
    nombre: str
    apellido: str
    telefono: str
    email: str | None = None
    instagram: str | None = None


class ClienteCreate(ClienteBase):
    pass


class ClienteRespuesta(ClienteBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
