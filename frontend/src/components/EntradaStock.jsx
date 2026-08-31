import { API } from "../config"
import { useEffect, useRef, useState } from "react"

export default function EntradaStock() {
  const scannerRef = useRef(null)
  const [productos, setProductos] = useState([])
  const [items, setItems] = useState([])
  const [codigo, setCodigo] = useState("")
  const [motivo, setMotivo] = useState("Ingreso de mercadería")
  const [mensaje, setMensaje] = useState("")
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    cargarProductos()
    scannerRef.current?.focus()
  }, [])

  async function cargarProductos() {
    try {
      const res = await fetch(`${API}/productos/`)
      if (!res.ok) throw new Error("No se pudieron cargar los productos")
      const data = await res.json()
      setProductos(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e.message || "Error cargando productos")
    }
  }

  function buscarProducto(valor) {
    const texto = String(valor || "").trim().toLowerCase()
    return productos.find(p =>
      String(p.codigo || "").trim().toLowerCase() === texto ||
      String(p.codigo_barras || "").trim().toLowerCase() === texto
    )
  }

  function agregarCodigo(valor) {
    const producto = buscarProducto(valor)
    if (!producto) {
      setError(`Código no encontrado: ${valor}`)
      return
    }

    setItems(prev => {
      const existente = prev.find(item => item.producto_id === producto.id)
      if (existente) {
        return prev.map(item =>
          item.producto_id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      }

      return [
        ...prev,
        {
          producto_id: producto.id,
          codigo: producto.codigo,
          codigo_barras: producto.codigo_barras,
          nombre: producto.nombre,
          stock_actual: Number(producto.stock || 0),
          cantidad: 1
        }
      ]
    })

    setError("")
  }

  function manejarScanner(e) {
    if (e.key !== "Enter") return
    e.preventDefault()
    const valor = codigo.trim()
    if (!valor) return
    agregarCodigo(valor)
    setCodigo("")
    setTimeout(() => scannerRef.current?.focus(), 0)
  }

  function cambiarCantidad(productoId, valor) {
    const cantidad = Math.max(1, Number(valor) || 1)
    setItems(prev => prev.map(item =>
      item.producto_id === productoId ? { ...item, cantidad } : item
    ))
  }

  function quitarItem(productoId) {
    setItems(prev => prev.filter(item => item.producto_id !== productoId))
    setTimeout(() => scannerRef.current?.focus(), 0)
  }

  function limpiar() {
    setItems([])
    setError("")
    setMensaje("")
    setTimeout(() => scannerRef.current?.focus(), 0)
  }

  async function confirmarIngreso() {
    if (items.length === 0) {
      setError("Primero cargá al menos un código.")
      return
    }

    if (!motivo.trim()) {
      setError("Ingresá el motivo del movimiento.")
      return
    }

    setCargando(true)
    setError("")
    setMensaje("")

    try {
      const res = await fetch(`${API}/stock/entrada-masiva`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          motivo: motivo.trim(),
          items: items.map(item => ({
            codigo: item.codigo,
            cantidad: item.cantidad
          }))
        })
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.detail || "No se pudo confirmar el ingreso")

      setMensaje(`Ingreso confirmado correctamente ✅ Se cargaron ${data.total_unidades} prendas en ${data.productos_afectados} productos.`)
      setItems([])
      await cargarProductos()
      setTimeout(() => scannerRef.current?.focus(), 0)
    } catch (e) {
      setError(e.message || "No se pudo confirmar el ingreso")
    } finally {
      setCargando(false)
    }
  }

  async function importarExcel(e) {
    const archivo = e.target.files?.[0]
    e.target.value = ""
    if (!archivo) return

    const formData = new FormData()
    formData.append("archivo", archivo)

    setCargando(true)
    setError("")
    setMensaje("")

    try {
      const res = await fetch(`${API}/stock/importar-excel`, {
        method: "POST",
        body: formData
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.detail || "No se pudo leer el Excel")

      if (data.errores?.length) {
        setError(data.errores.join(" | "))
      }

      if (data.items?.length) {
        setItems(prev => {
          const mapa = new Map(prev.map(item => [item.producto_id, item]))
          data.items.forEach(item => {
            const existente = mapa.get(item.producto_id)
            mapa.set(item.producto_id, {
              ...item,
              cantidad: (existente?.cantidad || 0) + Number(item.cantidad)
            })
          })
          return Array.from(mapa.values())
        })
        setMensaje(`Excel leído correctamente. Revisá el resumen y confirmá el ingreso.`)
      }
    } catch (e) {
      setError(e.message || "No se pudo leer el Excel")
    } finally {
      setCargando(false)
      setTimeout(() => scannerRef.current?.focus(), 0)
    }
  }

  const totalUnidades = items.reduce((suma, item) => suma + Number(item.cantidad || 0), 0)

  return (
    <div style={{ padding: "24px", maxWidth: "1400px", margin: "0 auto" }}>
      <h1>📥 Entrada masiva de stock</h1>
      <p style={{ color: "#666" }}>Cargá muchas prendas por escáner o importá un Excel. El stock se modifica recién al confirmar.</p>

      {mensaje && <div style={{ background: "#dcfce7", color: "#166534", padding: "12px 16px", borderRadius: "8px", marginBottom: "15px", fontWeight: "bold" }}>{mensaje}</div>}
      {error && <div style={{ background: "#fee2e2", color: "#991b1b", padding: "12px 16px", borderRadius: "8px", marginBottom: "15px" }}>{error}</div>}

      <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "20px" }}>
        <h2>🔎 Escanear códigos</h2>
        <p style={{ color: "#666" }}>Pasá las etiquetas una atrás de otra. Si un código se repite, la cantidad se acumula automáticamente.</p>
        <input
          ref={scannerRef}
          autoFocus
          value={codigo}
          onChange={e => setCodigo(e.target.value)}
          onKeyDown={manejarScanner}
          placeholder="Escaneá un código de barras..."
          style={{ width: "100%", padding: "16px", fontSize: "18px", border: "2px solid #16a34a", borderRadius: "8px", boxSizing: "border-box" }}
        />
      </div>

      <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginBottom: "20px" }}>
        <h2>📊 Importar Excel</h2>
        <p style={{ color: "#666" }}>Formato recomendado: columnas <strong>codigo</strong> y <strong>cantidad</strong>. No modifica stock hasta confirmar.</p>
        <label style={{ display: "inline-block", padding: "12px 18px", background: "#2563eb", color: "#fff", borderRadius: "7px", cursor: "pointer", fontWeight: "bold" }}>
          📂 Seleccionar Excel
          <input type="file" accept=".xlsx,.xls" onChange={importarExcel} style={{ display: "none" }} />
        </label>
      </div>

      <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "15px", flexWrap: "wrap" }}>
          <h2>🧾 Resumen de ingreso</h2>
          <strong style={{ fontSize: "18px" }}>Total prendas: {totalUnidades}</strong>
        </div>

        {items.length === 0 ? (
          <div style={{ padding: "30px 10px", textAlign: "center", color: "#777" }}>Todavía no hay prendas cargadas.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f3f4f6" }}>
                  <th style={{ padding: "10px", textAlign: "left" }}>Código</th>
                  <th style={{ padding: "10px", textAlign: "left" }}>Producto</th>
                  <th style={{ padding: "10px" }}>Stock actual</th>
                  <th style={{ padding: "10px" }}>Ingreso</th>
                  <th style={{ padding: "10px" }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.producto_id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "10px" }}>{item.codigo}</td>
                    <td style={{ padding: "10px" }}>{item.nombre}</td>
                    <td style={{ padding: "10px", textAlign: "center" }}>{item.stock_actual}</td>
                    <td style={{ padding: "10px", textAlign: "center" }}>
                      <input type="number" min="1" value={item.cantidad} onChange={e => cambiarCantidad(item.producto_id, e.target.value)} style={{ width: "80px", padding: "8px", textAlign: "center" }} />
                    </td>
                    <td style={{ padding: "10px", textAlign: "center" }}>
                      <button onClick={() => quitarItem(item.producto_id)} style={{ padding: "7px 10px", cursor: "pointer" }}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: "20px" }}>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: "6px" }}>Motivo</label>
          <input value={motivo} onChange={e => setMotivo(e.target.value)} placeholder="Ej: Ingreso proveedor Mina" style={{ width: "100%", padding: "11px", border: "1px solid #ccc", borderRadius: "7px", boxSizing: "border-box" }} />
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap" }}>
          <button onClick={confirmarIngreso} disabled={cargando || items.length === 0} style={{ padding: "13px 20px", border: "none", borderRadius: "7px", background: "#16a34a", color: "#fff", fontWeight: "bold", cursor: "pointer" }}>
            {cargando ? "Procesando..." : "✅ CONFIRMAR INGRESO"}
          </button>
          <button onClick={limpiar} disabled={cargando} style={{ padding: "13px 20px", border: "1px solid #ccc", borderRadius: "7px", background: "#fff", cursor: "pointer" }}>
            🧹 Limpiar
          </button>
        </div>
      </div>
    </div>
  )
}
