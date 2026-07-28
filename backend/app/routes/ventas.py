from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.venta import Venta
from app.models.detalle_venta import DetalleVenta
from app.models.producto import Producto

from app.schemas.venta import VentaRespuesta
from pydantic import BaseModel


router = APIRouter(
    prefix="/ventas",
    tags=["Ventas"]
)


class ProductoVenta(BaseModel):
    producto_id: int
    cantidad: int
    precio_unitario: float


class VentaNueva(BaseModel):
    cliente_id: int
    metodo_pago: str
    productos: list[ProductoVenta]


@router.post("/", response_model=VentaRespuesta)
def crear_venta(venta: VentaNueva, db: Session = Depends(get_db)):

    total = 0

    for item in venta.productos:
        total += item.cantidad * item.precio_unitario


    nueva_venta = Venta(
        cliente_id=venta.cliente_id,
        total=total,
        metodo_pago=venta.metodo_pago
    )

    db.add(nueva_venta)
    db.commit()
    db.refresh(nueva_venta)


    for item in venta.productos:

        detalle = DetalleVenta(
            venta_id=nueva_venta.id,
            producto_id=item.producto_id,
            cantidad=item.cantidad,
            precio_unitario=item.precio_unitario
        )

        db.add(detalle)


        producto = db.query(Producto).filter(
            Producto.id == item.producto_id
        ).first()

        if producto:
            producto.stock -= item.cantidad


    db.commit()

    return nueva_venta



@router.get("/", response_model=list[VentaRespuesta])
def listar_ventas(db: Session = Depends(get_db)):

    return db.query(Venta).all()
