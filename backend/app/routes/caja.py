from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.caja import MovimientoCaja


router = APIRouter(
    prefix="/caja",
    tags=["Caja"]
)


class MovimientoCajaCrear(BaseModel):
    tipo: str
    concepto: str
    monto: float


class MovimientoCajaRespuesta(BaseModel):
    id: int
    tipo: str
    concepto: str
    monto: float
    fecha: object

    class Config:
        from_attributes = True


@router.post("/", response_model=MovimientoCajaRespuesta)
def crear_movimiento(
    movimiento: MovimientoCajaCrear,
    db: Session = Depends(get_db)
):

    if movimiento.tipo not in ["ingreso", "gasto"]:
        raise HTTPException(
            status_code=400,
            detail="El tipo debe ser ingreso o gasto"
        )

    if movimiento.monto <= 0:
        raise HTTPException(
            status_code=400,
            detail="El monto debe ser mayor a 0"
        )

    nuevo = MovimientoCaja(
        tipo=movimiento.tipo,
        concepto=movimiento.concepto,
        monto=movimiento.monto
    )

    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)

    return nuevo


@router.get("/", response_model=list[MovimientoCajaRespuesta])
def listar_movimientos(
    db: Session = Depends(get_db)
):

    return db.query(
        MovimientoCaja
    ).order_by(
        MovimientoCaja.fecha.desc()
    ).all()
