from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.stock import MovimientoStock
from app.models.producto import Producto
from app.schemas.stock import MovimientoStockCreate, MovimientoStockRespuesta


router = APIRouter(
    prefix="/stock",
    tags=["Stock"]
)



# Ver movimientos
@router.get("/", response_model=list[MovimientoStockRespuesta])
def listar_movimientos(
    db: Session = Depends(get_db)
):

    return db.query(MovimientoStock).all()



# Registrar entrada de mercadería
@router.post("/entrada", response_model=MovimientoStockRespuesta)
def entrada_stock(
    movimiento: MovimientoStockCreate,
    db: Session = Depends(get_db)
):

    producto = db.query(Producto).filter(
        Producto.id == movimiento.producto_id
    ).first()


    if not producto:
        raise HTTPException(
            status_code=404,
            detail="Producto no encontrado"
        )


    # sumar stock
    producto.stock += movimiento.cantidad


    nuevo_movimiento = MovimientoStock(
        producto_id=movimiento.producto_id,
        tipo="entrada",
        cantidad=movimiento.cantidad,
        motivo=movimiento.motivo
    )


    db.add(nuevo_movimiento)
    db.commit()
    db.refresh(nuevo_movimiento)


    return nuevo_movimiento
