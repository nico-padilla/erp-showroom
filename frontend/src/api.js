import { API } from "./config"
import { obtenerToken, borrarToken } from "./auth"

export async function apiFetch(ruta, opciones = {}) {
  const token = obtenerToken()

  const headers = new Headers(opciones.headers || {})

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const url = /^https?:\/\//i.test(ruta) ? ruta : `${API}${ruta}`

  const respuesta = await fetch(url, {
    ...opciones,
    headers,
  })

  if (respuesta.status === 401) {
    borrarToken()
    window.location.reload()
    throw new Error("Sesión expirada. Iniciá sesión nuevamente.")
  }

  return respuesta
}
