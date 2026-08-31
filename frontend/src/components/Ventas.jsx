import { API } from "../config"
import { useEffect, useState } from "react"

export default function Ventas() {
  const [productos, setProductos] = useState([])
  const [ventas, setVentas] = useState([])
  const [clientes, setClientes] = useState([])
  const [carrito, setCarrito] = useState([])

  const [busqueda, setBusqueda] = useState("")
  const [cantidad, setCantidad] = useState(1)
  const [clienteId, setClienteId] = useState("")
  const [metodoPago, setMetodoPago] = useState("Efectivo")

  const [mensaje, setMensaje] = useState("")
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)

  const [ultimaVenta, setUltimaVenta] = useState(null)

  useEffect(() => {
    cargarProductos()
    cargarVentas()
    cargarClientes()
  }, [])

  async function cargarProductos() {
    try {
      const res = await fetch(`${API}/productos/`)
      if (!res.ok) throw new Error("No se pudieron cargar los productos")
      const data = await res.json()
      setProductos(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
      setError(error.message || "Error cargando productos")
    }
  }

  async function cargarVentas() {
    try {
      const res = await fetch(`${API}/ventas/`)
      if (!res.ok) throw new Error("No se pudieron cargar las ventas")
      const data = await res.json()
      setVentas(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
    }
  }

  async function cargarClientes() {
    try {
      const res = await fetch(`${API}/clientes/`)
      if (!res.ok) throw new Error("No se pudieron cargar los clientes")
      const data = await res.json()
      setClientes(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
    }
  }

  function manejarEscaneo(e) {
    const codigo = String(e.target.value || "").trim()

    if (!codigo) return

    const producto = productos.find(
      p =>
        String(p.codigo_barras || "").trim() === codigo ||
        String(p.codigo || "").trim() === codigo
    )

    if (!producto) {
      return
    }

    agregarAlCarrito(producto)
  }  
function agregarAlCarrito(producto) {
    const cantidadAgregar = Number(cantidad)

    if (!cantidadAgregar || cantidadAgregar < 1) {
      setError("La cantidad debe ser mayor a 0")
      return
    }

    if (cantidadAgregar > Number(producto.stock)) {
      setError(`Stock disponible: ${producto.stock}`)
      return
    }

    const existente = carrito.find(item => item.producto_id === producto.id)

    if (existente) {
      const nuevaCantidad = existente.cantidad + cantidadAgregar

      if (nuevaCantidad > Number(producto.stock)) {
        setError(`Stock disponible: ${producto.stock}`)
        return
      }

      setCarrito(
        carrito.map(item =>
          item.producto_id === producto.id
            ? {
                ...item,
                cantidad: nuevaCantidad,
                subtotal: nuevaCantidad * item.precio
              }
            : item
        )
      )
    } else {
      setCarrito([
        ...carrito,
        {
          producto_id: producto.id,
          codigo: producto.codigo,
          nombre: producto.nombre,
          precio: Number(producto.precio_venta),
          cantidad: cantidadAgregar,
          subtotal: cantidadAgregar * Number(producto.precio_venta)
        }
      ])
    }

    setBusqueda("")
    setCantidad(1)
    setError("")
  }

  function cambiarCantidad(id, valor) {
    const nuevaCantidad = Number(valor)
    const producto = productos.find(p => p.id === id)

    if (!producto) return
    if (nuevaCantidad < 1) return

    if (nuevaCantidad > Number(producto.stock)) {
      setError(`Stock disponible: ${producto.stock}`)
      return
    }

    setCarrito(
      carrito.map(item =>
        item.producto_id === id
          ? {
              ...item,
              cantidad: nuevaCantidad,
              subtotal: nuevaCantidad * item.precio
            }
          : item
      )
    )

    setError("")
  }

  function eliminarDelCarrito(id) {
    setCarrito(carrito.filter(item => item.producto_id !== id))
  }

  const total = carrito.reduce(
    (suma, item) => suma + Number(item.subtotal),
    0
  )

  const productosFiltrados = productos.filter(producto => {
    const texto = String(busqueda || "").toLowerCase()

    return (
      String(producto.nombre || "").toLowerCase().includes(texto) ||
      String(producto.codigo || "").toLowerCase().includes(texto) ||
      String(producto.codigo_barras || "").toLowerCase().includes(texto)
    )
  })

  async function realizarVenta() {
    if (carrito.length === 0) {
      setError("El carrito está vacío")
      return
    }

    if (!clienteId) {
      setError("Seleccioná un cliente")
      return
    }

    setCargando(true)
    setError("")
    setMensaje("")

    try {
      const venta = {
        cliente_id: Number(clienteId),
        metodo_pago: metodoPago,
        productos: carrito.map(item => ({
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          precio_unitario: item.precio
        }))
      }

      console.log("VENTA ENVIADA:", venta)

      const res = await fetch(`${API}/ventas/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(venta)
      })

      const data = await res.json()

      if (!res.ok) {
        const detalle =
          typeof data?.detail === "string"
            ? data.detail
            : JSON.stringify(data?.detail || data)
        throw new Error(detalle)
      }

      const clienteSeleccionado = clientes.find(
        cliente => Number(cliente.id) === Number(clienteId)
      )

      const ventaCompleta = {
        ...data,
        cliente_id: Number(clienteId),
        cliente: clienteSeleccionado,
        metodo_pago: metodoPago,
        detalles: carrito,
        total
      }

      setUltimaVenta(ventaCompleta)
      setVentas(prev => [ventaCompleta, ...prev])
      setMensaje("Venta realizada correctamente ✅")
      imprimirTicket(ventaCompleta)
      setCarrito([])
      setClienteId("")
      await cargarProductos()
    } catch (error) {
      console.error("ERROR VENTA:", error)
      setError(error?.message || "No se pudo realizar la venta")
    } finally {
      setCargando(false)
    }
  }

  function imprimirTicket(venta) {
    const ventana = window.open("", "_blank", "width=400,height=700")

    if (!ventana) {
      alert("El navegador bloqueó la ventana de impresión.")
      return
    }

    const detalles = venta.detalles || []

    const escaparHTML = texto =>
      String(texto ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")

    const filas = detalles.map(item => {
      const nombre = escaparHTML(item.nombre)
      const cantidad = Number(item.cantidad || 0)
      const precio = Number(item.precio || 0)
      const subtotal = Number(item.subtotal || 0)

      return `
        <div class="producto">
          <div class="producto-nombre">${nombre}</div>
          <div class="producto-linea">
            <span>${cantidad} x $${precio.toLocaleString("es-AR")}</span>
            <strong>$${subtotal.toLocaleString("es-AR")}</strong>
          </div>
        </div>
      `
    }).join("")

    const numeroVenta = escaparHTML(venta.id || "")
    const metodoPago = escaparHTML(venta.metodo_pago || "-")
    const totalVenta = Number(venta.total || 0)

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Ticket Venta #${numeroVenta}</title>
<style>
@page { size: 80mm auto; margin: 0; }
* { box-sizing: border-box; }
html, body { width: 80mm; margin: 0; padding: 0; background: white; }
body { padding: 6mm 4mm; font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #000; }
.centrado { text-align: center; }
.nombre { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
.direccion { font-size: 11px; line-height: 1.4; }
.linea { border-top: 1px dashed #000; margin: 10px 0; }
.venta { font-size: 11px; line-height: 1.6; }
.detalle-titulo { font-size: 13px; font-weight: bold; margin-bottom: 8px; }
.producto { margin-bottom: 9px; }
.producto-nombre { font-weight: bold; font-size: 12px; margin-bottom: 3px; }
.producto-linea { display: flex; justify-content: space-between; gap: 5px; font-size: 11px; }
.total { text-align: center; font-size: 20px; font-weight: bold; margin: 15px 0; }
.gracias { text-align: center; font-size: 13px; font-weight: bold; margin-top: 15px; }
.contacto { text-align: center; font-size: 10px; margin-top: 8px; }
</style>
</head>
<body>
<div class="centrado">
<div class="nombre">MARÍA PAZ SHOWROOM</div>
<div class="direccion">Luro 3162, Oficina 302</div>
<div class="direccion">Mar del Plata</div>
<div class="direccion">WhatsApp: 223 6001990</div>
<div class="direccion">Instagram: @mariapaz.mdp</div>
</div>
<div class="linea"></div>
<div class="venta">
<strong>Venta:</strong> #${numeroVenta}<br>
<strong>Fecha:</strong> ${new Date().toLocaleString("es-AR")}<br>
<strong>Medio de pago:</strong> ${metodoPago}
</div>
<div class="linea"></div>
<div class="detalle-titulo">DETALLE DE COMPRA</div>
${filas}
<div class="linea"></div>
<div class="total">TOTAL<br>$${totalVenta.toLocaleString("es-AR")}</div>
<div class="gracias">¡Gracias por tu compra!</div>
<div class="contacto">María Paz Showroom</div>
</body>
</html>
`

    ventana.document.open()
    ventana.document.write(html)
    ventana.document.close()

    ventana.onload = function () {
      setTimeout(() => {
        ventana.focus()
        ventana.print()
      }, 300)
    }
  }

  function enviarWhatsApp(venta) {
    if (!venta) {
      alert("No hay una venta para enviar.")
      return
    }

    const cliente = venta.cliente || {}
    const telefono = cliente.telefono || cliente.celular || cliente.whatsapp || ""
    const nombreCliente = `${cliente.nombre || ""} ${cliente.apellido || ""}`.trim()

    let mensajeWhatsApp = `Hola ${nombreCliente || "😊"}!\n\n`
    mensajeWhatsApp += `Gracias por tu compra en María Paz Showroom 💕\n\n`
    mensajeWhatsApp += `🧾 *Venta #${venta.id}*\n`
    mensajeWhatsApp += `💳 Medio de pago: ${venta.metodo_pago}\n\n`
    mensajeWhatsApp += `*DETALLE DE COMPRA*\n`

    venta.detalles.forEach(item => {
      mensajeWhatsApp += `• ${item.nombre} - ${item.cantidad} x $${Number(item.precio).toLocaleString("es-AR")}\n`
      mensajeWhatsApp += `  Subtotal: $${Number(item.subtotal).toLocaleString("es-AR")}\n`
    })

    mensajeWhatsApp += `\n💰 *TOTAL: $${Number(venta.total).toLocaleString("es-AR")}*\n\n`
    mensajeWhatsApp += `¡Gracias por elegirnos! 💕\n`
    mensajeWhatsApp += `María Paz Showroom\n`
    mensajeWhatsApp += `📍 Luro 3162, Oficina 302 - Mar del Plata`

    const textoCodificado = encodeURIComponent(mensajeWhatsApp)

    if (telefono) {
      let numero = String(telefono).replace(/\D/g, "")

      if (numero.startsWith("0")) numero = numero.substring(1)

      if (numero.length === 10 && !numero.startsWith("54")) {
        numero = `54${numero}`
      }

      window.open(`https://wa.me/${numero}?text=${textoCodificado}`, "_blank")
      return
    }

    window.open(`https://wa.me/?text=${textoCodificado}`, "_blank")
  }

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "1400px",
        width: "100%",
        margin: "0 auto",
        boxSizing: "border-box",
        minWidth: 0
      }}
    >
      <h1>🛒 Ventas</h1>

      {mensaje && (
        <div style={{
          background: "#d1fae5",
          padding: "12px",
          marginBottom: "15px",
          borderRadius: "8px"
        }}>
          {mensaje}
        </div>
      )}

      {error && (
        <div style={{
          background: "#fee2e2",
          color: "#991b1b",
          padding: "12px",
          marginBottom: "15px",
          borderRadius: "8px"
        }}>
          {error}
        </div>
      )}

      {ultimaVenta && (
        <div style={{
          background: "#f0fdf4",
          border: "1px solid #86efac",
          padding: "15px",
          marginBottom: "20px",
          borderRadius: "10px"
        }}>
          <strong>✅ Venta #{ultimaVenta.id} realizada</strong>

          <div style={{
            display: "flex",
            gap: "10px",
            marginTop: "12px",
            flexWrap: "wrap"
          }}>
            <button
              onClick={() => imprimirTicket(ultimaVenta)}
              style={{ padding: "12px 18px", cursor: "pointer" }}
            >
              🖨️ IMPRIMIR TICKET
            </button>

            <button
              onClick={() => enviarWhatsApp(ultimaVenta)}
              style={{
                padding: "12px 18px",
                cursor: "pointer",
                background: "#25D366",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold"
              }}
            >
              📱 ENVIAR POR WHATSAPP
            </button>
          </div>
        </div>
      )}

      {/*
        IMPORTANTE:
        este grid mantiene BUSCAR PRODUCTO a la izquierda
        y CARRITO / REALIZAR VENTA a la derecha.
        minmax(0, 1fr) evita que el contenido fuerce
        al segundo panel a saltar debajo.
      */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(380px, 420px)",
          gap: "20px",
          alignItems: "start",
          width: "100%",
          minWidth: 0
        }}
      >
        <div style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
          minWidth: 0,
          boxSizing: "border-box"
        }}>
          <h2>🔎 Buscar producto</h2>

     <input
  value={busqueda}
  onChange={e => setBusqueda(e.target.value)}
  onKeyDown={e => {
    if (e.key === "Enter") {
      manejarEscaneo(e)
    }
  }}
  placeholder="Código, código de barras o nombre"
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px",
              boxSizing: "border-box"
            }}
          />

          <input
            type="number"
            min="1"
            value={cantidad}
            onChange={e => setCantidad(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              boxSizing: "border-box"
            }}
          />

          {busqueda && productosFiltrados.map(producto => (
            <div
              key={producto.id}
              onClick={() => agregarAlCarrito(producto)}
              style={{
                border: "1px solid #ddd",
                padding: "12px",
                marginBottom: "8px",
                cursor: "pointer",
                borderRadius: "8px"
              }}
            >
              <strong>{producto.nombre}</strong><br />
              Código: {producto.codigo}<br />
              Código de barras: {producto.codigo_barras || "-"}<br />
              Stock: {producto.stock}<br />
              Precio: ${Number(producto.precio_venta).toLocaleString("es-AR")}
            </div>
          ))}
        </div>

        <div style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
          minWidth: 0,
          boxSizing: "border-box",
          position: "sticky",
          top: "20px"
        }}>
          <h2>🛒 Carrito</h2>

          {carrito.length === 0 && <p>No hay productos agregados.</p>}

          {carrito.map(item => (
            <div
              key={item.producto_id}
              style={{
                borderBottom: "1px solid #ddd",
                padding: "10px 0"
              }}
            >
              <strong>{item.nombre}</strong><br />
              Código: {item.codigo}<br />

              <input
                type="number"
                min="1"
                value={item.cantidad}
                onChange={e => cambiarCantidad(item.producto_id, e.target.value)}
                style={{ width: "70px", marginRight: "10px" }}
              />

              ${Number(item.subtotal).toLocaleString("es-AR")}

              <button
                onClick={() => eliminarDelCarrito(item.producto_id)}
                style={{ marginLeft: "10px" }}
              >
                🗑️
              </button>
            </div>
          ))}

          <hr />

          <h2>TOTAL: ${total.toLocaleString("es-AR")}</h2>

          <label>Cliente</label>
          <select
            value={clienteId}
            onChange={e => setClienteId(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              margin: "8px 0",
              boxSizing: "border-box"
            }}
          >
            <option value="">Seleccionar cliente</option>
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombre} {cliente.apellido}
              </option>
            ))}
          </select>

          <label>Medio de pago</label>
          <select
            value={metodoPago}
            onChange={e => setMetodoPago(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              margin: "8px 0 15px",
              boxSizing: "border-box"
            }}
          >
            <option value="Efectivo">💵 Efectivo</option>
            <option value="Tarjeta de débito">💳 Tarjeta de débito</option>
            <option value="Tarjeta de crédito">💳 Tarjeta de crédito</option>
            <option value="Transferencia">📱 Transferencia</option>
            <option value="Mercado Pago">🟡 Mercado Pago</option>
          </select>

          <button
            onClick={realizarVenta}
            disabled={cargando || carrito.length === 0}
            style={{
              width: "100%",
              padding: "15px",
              fontSize: "18px",
              cursor: cargando ? "not-allowed" : "pointer"
            }}
          >
            {cargando ? "Procesando..." : "💰 REALIZAR VENTA"}
          </button>
        </div>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>📋 Historial de ventas</h2>
        {ventas.map(venta => (
          <div
            key={venta.id}
            style={{
              background: "#fff",
              padding: "12px",
              marginBottom: "8px",
              borderRadius: "8px"
            }}
          >
            <strong>Venta #{venta.id}</strong> — ${Number(venta.total).toLocaleString("es-AR")} — {venta.metodo_pago}
          </div>
        ))}
      </div>
    </div>
  )
}
