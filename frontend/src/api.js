import { API } from "./config"
import { obtenerToken, borrarToken } from "./auth"

const TIEMPO_LIMITE_MS = 90_000

export async function fetchConTimeout(url, opciones = {}) {
  const controlador = new AbortController()
  const temporizador = setTimeout(
    () => controlador.abort(),
    TIEMPO_LIMITE_MS
  )

  try {
    return await fetch(url, {
      ...opciones,
      signal: controlador.signal,
    })
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        "El servidor tardó demasiado en responder. Verificá que el backend esté activo e intentá de nuevo."
      )
    }

    if (error instanceof TypeError) {
      throw new Error(
        "No se pudo conectar con el servidor. Verificá que el backend esté disponible."
      )
    }

    throw error
  } finally {
    clearTimeout(temporizador)
  }
}

export async function apiFetch(ruta, opciones = {}) {
  const token = obtenerToken()

  const headers = new Headers(opciones.headers || {})

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const url = /^https?:\/\//i.test(ruta) ? ruta : `${API}${ruta}`

  const respuesta = await fetchConTimeout(url, {
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
