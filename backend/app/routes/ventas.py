from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db

from app.models.venta import Venta
from app.models.detalle_venta import DetalleVenta
from app.models.producto import Producto
from app.models.stock import MovimientoStock
from app.models.caja import MovimientoCaja

from app.schemas.venta import VentaRespuesta


router = APIRouter(
    prefix="/ventas",
    tags=["Ventas"]
)


# ==========================
# MODELOS PARA CREAR VENTA
# ==========================

class ProductoVenta(BaseModel):
    producto_id: int
    cantidad: int
    precio_unitario: float


class VentaNueva(BaseModel):
    cliente_id: int
    metodo_pago: str
    productos: list[ProductoVenta]


# ==========================
# CREAR VENTA
# ==========================

@router.post("/", response_model=VentaRespuesta)
def crear_venta(
    venta: VentaNueva,
    db: Session = Depends(get_db)
):

    # --------------------------
    # Validar que haya productos
    # --------------------------

    if not venta.productos:
        raise HTTPException(
            status_code=400,
            detail="La venta debe contener al menos un producto"
        )

    total = 0

    # --------------------------
    # Validar productos y stock
    # --------------------------

    for item in venta.productos:

        if item.cantidad <= 0:
            raise HTTPException(
                status_code=400,
                detail="La cantidad debe ser mayor a 0"
            )

        if item.precio_unitario < 0:
            raise HTTPException(
                status_code=400,
                detail="El precio no puede ser negativo"
            )

        producto = db.query(Producto).filter(
            Producto.id == item.producto_id
        ).first()

        if not producto:
            raise HTTPException(
                status_code=404,
                detail=f"Producto {item.producto_id} no encontrado"
            )

        if producto.stock < item.cantidad:
            raise HTTPException(
                status_code=400,
                detail=f"Stock insuficiente para {producto.nombre}. Stock disponible: {producto.stock}"
            )

        total += item.cantidad * item.precio_unitario

    # --------------------------
    # Crear venta
    # --------------------------

    nueva_venta = Venta(
        cliente_id=venta.cliente_id,
        total=total,
        metodo_pago=venta.metodo_pago
    )

    db.add(nueva_venta)

    # Generamos el ID de la venta
    db.flush()

    # --------------------------
    # Crear detalles
    # Descontar stock
    # Registrar movimiento stock
    # --------------------------

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

        # Descontar stock
        producto.stock -= item.cantidad

        # Registrar salida de stock
        movimiento_stock = MovimientoStock(
            producto_id=item.producto_id,
            tipo="salida",
            cantidad=item.cantidad,
            motivo=f"Venta #{nueva_venta.id}"
        )

        db.add(movimiento_stock)

    # --------------------------
    # REGISTRAR INGRESO EN CAJA
    # --------------------------

    movimiento_caja = MovimientoCaja(
        tipo="ingreso",
        concepto=f"Venta #{nueva_venta.id} - {venta.metodo_pago}",
        monto=total
    )

    db.add(movimiento_caja)

    # --------------------------
    # Guardar todo
    # --------------------------

    db.commit()

    db.refresh(nueva_venta)

    return nueva_venta


# ==========================
# LISTAR VENTAS
# ==========================

@router.get(
    "/",
    response_model=list[VentaRespuesta]
)
def listar_ventas(
    db: Session = Depends(get_db)
):

    return db.query(Venta).order_by(
        Venta.fecha.desc()
    ).all()
