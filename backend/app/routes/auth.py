from fastapi import APIRouter, HTTPException, Request, Header
from pydantic import BaseModel

from app.auth import (
    PIN_ERP,
    generar_token,
    token_valido,
    ip_bloqueada,
    registrar_intento_fallido,
    limpiar_intentos,
)

router = APIRouter(prefix="/auth", tags=["Autenticación"])


class LoginRequest(BaseModel):
    pin: str


@router.post("/login")
def login(datos: LoginRequest, request: Request):
    ip = request.client.host if request.client else "desconocida"

    if ip_bloqueada(ip):
        raise HTTPException(
            status_code=429,
            detail="Demasiados intentos. Esperá 5 minutos e intentá de nuevo."
        )

    if datos.pin.strip() != PIN_ERP:
        registrar_intento_fallido(ip)
        raise HTTPException(status_code=401, detail="PIN incorrecto")

    limpiar_intentos(ip)
    return {"token": generar_token()}


def requerir_token(authorization: str | None = Header(default=None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="No autenticado")

    token = authorization.removeprefix("Bearer ").strip()

    if not token_valido(token):
        raise HTTPException(status_code=401, detail="Sesión expirada, iniciá sesión de nuevo")
