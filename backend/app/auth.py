import os
import hmac
import hashlib
import base64
import time

PIN_ERP = os.getenv("PIN_ERP", "1234")
SECRET_KEY_ERP = os.getenv("SECRET_KEY_ERP", "clave-de-desarrollo-cambiar-en-produccion")
DURACION_TOKEN_SEGUNDOS = 12 * 60 * 60  # 12 horas

if not os.getenv("PIN_ERP") and os.getenv("RENDER"):
    raise RuntimeError("Falta PIN_ERP en Render: no se puede iniciar sin PIN configurado")

if not os.getenv("SECRET_KEY_ERP") and os.getenv("RENDER"):
    raise RuntimeError("Falta SECRET_KEY_ERP en Render: no se puede iniciar sin clave configurada")


def _firmar(mensaje: str) -> str:
    return hmac.new(SECRET_KEY_ERP.encode(), mensaje.encode(), hashlib.sha256).hexdigest()


def generar_token() -> str:
    expira = int(time.time()) + DURACION_TOKEN_SEGUNDOS
    mensaje = str(expira)
    firma = _firmar(mensaje)
    crudo = f"{mensaje}.{firma}"
    return base64.urlsafe_b64encode(crudo.encode()).decode()


def token_valido(token: str) -> bool:
    try:
        crudo = base64.urlsafe_b64decode(token.encode()).decode()
        mensaje, firma = crudo.split(".", 1)
        if not hmac.compare_digest(firma, _firmar(mensaje)):
            return False
        return time.time() < int(mensaje)
    except Exception:
        return False


# ---- Control de intentos fallidos ----
_intentos_fallidos = {}
MAX_INTENTOS = 5
BLOQUEO_SEGUNDOS = 5 * 60


def ip_bloqueada(ip: str) -> bool:
    _, bloqueado_hasta = _intentos_fallidos.get(ip, (0, 0))
    return time.time() < bloqueado_hasta


def registrar_intento_fallido(ip: str):
    intentos, _ = _intentos_fallidos.get(ip, (0, 0))
    intentos += 1
    bloqueado_hasta = time.time() + BLOQUEO_SEGUNDOS if intentos >= MAX_INTENTOS else 0
    _intentos_fallidos[ip] = (intentos, bloqueado_hasta)


def limpiar_intentos(ip: str):
    _intentos_fallidos.pop(ip, None)
