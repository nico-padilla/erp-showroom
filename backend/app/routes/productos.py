from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.producto import Producto
from app.schemas.producto import ProductoCreate, ProductoRespuesta

router = APIRouter(
    prefix="/productos",
    tags=["Productos"]
)


@router.post("/", response_model=ProductoRespuesta)
def crear_producto(producto: ProductoCreate, db: Session = Depends(get_db)):
    nuevo = Producto(**producto.model_dump())

    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)

    return nuevo


@router.get("/", response_model=list[ProductoRespuesta])
def listar_productos(db: Session = Depends(get_db)):
    return db.query(Producto).all()


@router.put("/{producto_id}", response_model=ProductoRespuesta)
def editar_producto(
    producto_id: int,
    producto: ProductoCreate,
    db: Session = Depends(get_db)
):
    producto_db = db.query(Producto).filter(Producto.id == producto_id).first()

    if not producto_db:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    datos = producto.model_dump()

    for campo, valor in datos.items():
        setattr(producto_db, campo, valor)

    db.commit()
    db.refresh(producto_db)

    return producto_db


@router.delete("/{producto_id}")
def eliminar_producto(
    producto_id: int,
    db: Session = Depends(get_db)
):
    producto_db = db.query(Producto).filter(Producto.id == producto_id).first()

    if not producto_db:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    db.delete(producto_db)
    db.commit()

    return {"mensaje": "Producto eliminado correctamente"}
