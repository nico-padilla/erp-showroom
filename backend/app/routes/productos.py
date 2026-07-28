from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.producto import Producto
from app.schemas.producto import ProductoCreate, ProductoRespuesta
from app.services.generador_codigo import generar_codigo

router = APIRouter(
    prefix="/productos",
    tags=["Productos"]
)


@router.post("/", response_model=ProductoRespuesta)
def crear_producto(producto: ProductoCreate, db: Session = Depends(get_db)):

    # Crear producto sin código
    nuevo = Producto(**producto.model_dump())

    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)

    # Generar código automático
    nuevo.codigo = generar_codigo(nuevo.id)

    db.commit()
    db.refresh(nuevo)

    return nuevo


@router.get("/", response_model=list[ProductoRespuesta])
def listar_productos(db: Session = Depends(get_db)):
    return db.query(Producto).all()
