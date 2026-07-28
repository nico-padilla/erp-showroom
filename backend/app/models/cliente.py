from sqlalchemy import Column, Integer, String
from app.database import Base


class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True)

    nombre = Column(String)
    apellido = Column(String)

    telefono = Column(String, unique=True)
    email = Column(String, nullable=True)

    instagram = Column(String, nullable=True)
