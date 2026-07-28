from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.cliente import Cliente
from app.schemas.cliente import ClienteCreate, ClienteRespuesta


router = APIRouter(
    prefix="/clientes",
    tags=["Clientes"]
)


@router.post("/", response_model=ClienteRespuesta)
def crear_cliente(cliente: ClienteCreate, db: Session = Depends(get_db)):
    nuevo_cliente = Cliente(**cliente.model_dump())

    db.add(nuevo_cliente)
    db.commit()
    db.refresh(nuevo_cliente)

    return nuevo_cliente


@router.get("/", response_model=list[ClienteRespuesta])
def listar_clientes(db: Session = Depends(get_db)):
    return db.query(Cliente).all()
