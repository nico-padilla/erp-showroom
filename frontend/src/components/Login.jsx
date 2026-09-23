import { useState } from "react"
import { API } from "../config"
import { guardarToken } from "../auth"

export default function Login({ onIngresar }) {
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    setError("")
    setCargando(true)

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || "No se pudo iniciar sesión")
      }

      guardarToken(data.token)
      onIngresar()
    } catch (err) {
      setError(err.message)
      setPin("")
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-crema flex items-center justify-center p-4">
      <form
        onSubmit={enviar}
        className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-xs text-center"
      >
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rosa flex items-center justify-center text-3xl mb-4">
          👗
        </div>

        <h1 className="text-xl font-extrabold text-tinta">María Paz</h1>
        <p className="text-sm text-tinta/60 mb-6">Ingresá el PIN para continuar</p>

        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          autoFocus
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          className="w-full text-center text-3xl tracking-[0.5em] border border-tinta/15 rounded-xl py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-flor/30 focus:border-flor"
          placeholder="••••"
        />

        {error && (
          <p className="text-flor text-sm font-semibold mb-4">{error}</p>
        )}

        <button
          type="submit"
          disabled={cargando || pin.length !== 4}
          className="w-full bg-flor text-white py-3 rounded-xl font-bold hover:opacity-90 disabled:opacity-40 transition-opacity"
        >
          {cargando ? "Verificando..." : "Ingresar"}
        </button>
      </form>
    </div>
  )
}
