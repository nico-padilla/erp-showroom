const CLAVE = "erp_token"

export function guardarToken(token) {
  sessionStorage.setItem(CLAVE, token)
}

export function obtenerToken() {
  return sessionStorage.getItem(CLAVE)
}

export function borrarToken() {
  sessionStorage.removeItem(CLAVE)
}

export function haySesion() {
  return Boolean(obtenerToken())
}
