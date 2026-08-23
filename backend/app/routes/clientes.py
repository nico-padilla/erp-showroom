from fastapi import APIRouter, Depends, HTTPException
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


@router.put("/{cliente_id}", response_model=ClienteRespuesta)
def actualizar_cliente(
    cliente_id: int,
    cliente: ClienteCreate,
    db: Session = Depends(get_db)
):
    cliente_existente = db.query(Cliente).filter(Cliente.id == cliente_id).first()

    if not cliente_existente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")

    datos = cliente.model_dump()

    for campo, valor in datos.items():
        setattr(cliente_existente, campo, valor)

    db.commit()
    db.refresh(cliente_existente)

    return cliente_existente
