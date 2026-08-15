import { useEffect, useState } from "react"

const API = "http://127.0.0.1:8000"

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

  useEffect(() => {
    cargarProductos()
    cargarVentas()
    cargarClientes()
  }, [])

  async function cargarProductos() {
    try {
      const res = await fetch(`${API}/productos/`)

      if (!res.ok) {
        throw new Error("No se pudieron cargar los productos")
      }

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

      if (!res.ok) {
        throw new Error("No se pudieron cargar las ventas")
      }

      const data = await res.json()
      setVentas(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
    }
  }

  async function cargarClientes() {
    try {
      const res = await fetch(`${API}/clientes/`)

      if (!res.ok) {
        throw new Error("No se pudieron cargar los clientes")
      }

      const data = await res.json()
      setClientes(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
    }
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

    const existente = carrito.find(
      item => item.producto_id === producto.id
    )

    if (existente) {
      const nuevaCantidad =
        existente.cantidad + cantidadAgregar

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
                subtotal:
                  nuevaCantidad * item.precio
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
          subtotal:
            cantidadAgregar *
            Number(producto.precio_venta)
        }
      ])
    }

    setBusqueda("")
    setCantidad(1)
    setError("")
  }

  function cambiarCantidad(id, valor) {
    const nuevaCantidad = Number(valor)

    const producto = productos.find(
      p => p.id === id
    )

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
              subtotal:
                nuevaCantidad * item.precio
            }
          : item
      )
    )

    setError("")
  }

  function eliminarDelCarrito(id) {
    setCarrito(
      carrito.filter(
        item => item.producto_id !== id
      )
    )
  }

  const total = carrito.reduce(
    (suma, item) =>
      suma + Number(item.subtotal),
    0
  )

  const productosFiltrados = productos.filter(producto => {
    const texto =
      String(busqueda || "").toLowerCase()

    return (
      String(producto.nombre || "")
        .toLowerCase()
        .includes(texto) ||
      String(producto.codigo || "")
        .toLowerCase()
        .includes(texto) ||
      String(producto.codigo_barras || "")
        .toLowerCase()
        .includes(texto)
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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(venta)
      })

      const data = await res.json()

      if (!res.ok) {
        const detalle =
          typeof data?.detail === "string"
            ? data.detail
            : JSON.stringify(
                data?.detail || data
              )

        throw new Error(detalle)
      }

      const ventaCompleta = {
        ...data,
        cliente_id: Number(clienteId),
        metodo_pago: metodoPago,
        detalles: carrito,
        total: total
      }

      setVentas(prev => [
        ...prev,
        ventaCompleta
      ])

      setMensaje(
        "Venta realizada correctamente ✅"
      )

      imprimirTicket(ventaCompleta)

      setCarrito([])
      setClienteId("")

      await cargarProductos()

    } catch (error) {
      console.error("ERROR VENTA:", error)

      setError(
        error?.message ||
        "No se pudo realizar la venta"
      )

    } finally {
      setCargando(false)
    }
  }

  function imprimirTicket(venta) {
    const ventana = window.open(
      "",
      "_blank",
      "width=400,height=700"
    )

    if (!ventana) {
      alert(
        "El navegador bloqueó la ventana de impresión."
      )
      return
    }

    const detalles =
      venta.detalles || []

    const filas = detalles
      .map(item => `
        <div style="margin:10px 0">
          <strong>${item.nombre}</strong>
          <br>
          Código: ${item.codigo || ""}
          <br>
          ${item.cantidad} x
          $${Number(item.precio).toLocaleString("es-AR")}
          <strong style="float:right">
            $${Number(item.subtotal).toLocaleString("es-AR")}
          </strong>
        </div>
      `)
      .join("")

    ventana.document.write(`
      <!DOCTYPE html>

      <html lang="es">

      <head>

        <title>
          Ticket Venta #${venta.id || ""}
        </title>

        <style>

          @page {
            size: 80mm auto;
            margin: 0;
          }

          body {
            width: 80mm;
            margin: 0;
            padding: 10px;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: #000;
          }

          .centrado {
            text-align: center;
          }

          .nombre {
            font-size: 20px;
            font-weight: bold;
          }

          .linea {
            border-top: 1px dashed #000;
            margin: 10px 0;
          }

          .total {
            font-size: 20px;
            font-weight: bold;
            text-align: center;
            margin: 15px 0;
          }

          .gracias {
            text-align: center;
            font-weight: bold;
            margin-top: 15px;
          }

        </style>

      </head>

      <body>

        <div class="centrado">

          <div class="nombre">
            MARÍA PAZ SHOWROOM
          </div>

          <div>
            Luro 3162, Oficina 302
          </div>

          <div>
            Mar del Plata
          </div>

          <div>
            WhatsApp: 223 6001990
          </div>

          <div>
            Instagram: @mariapaz.mdp
          </div>

        </div>

        <div class="linea"></div>

        <strong>Venta:</strong>
        #${venta.id || ""}

        <br>

        <strong>Fecha:</strong>
        ${new Date().toLocaleString("es-AR")}

        <br>

        <strong>Medio de pago:</strong>
        ${venta.metodo_pago}

        <div class="linea"></div>

        <strong>DETALLE DE COMPRA</strong>

        ${filas}

        <div class="linea"></div>

        <div class="total">
          TOTAL
          <br>
          $${Number(venta.total).toLocaleString("es-AR")}
        </div>

        <div class="gracias">
          ¡Gracias por tu compra!
        </div>

        <script>
          window.onload = function() {
            window.print()
          }
        </script>

      </body>

      </html>
    `)

    ventana.document.close()
  }

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "1400px",
        margin: "0 auto"
      }}
    >

      <h1>🛒 Ventas</h1>

      {mensaje && (
        <div
          style={{
            background: "#d1fae5",
            padding: "12px",
            marginBottom: "15px"
          }}
        >
          {mensaje}
        </div>
      )}

      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "12px",
            marginBottom: "15px"
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px"
        }}
      >

        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "10px"
          }}
        >

          <h2>🔎 Buscar producto</h2>

          <input
            value={busqueda}
            onChange={e =>
              setBusqueda(e.target.value)
            }
            placeholder="Código, código de barras o nombre"
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px"
            }}
          />

          <input
            type="number"
            min="1"
            value={cantidad}
            onChange={e =>
              setCantidad(e.target.value)
            }
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px"
            }}
          />

          {busqueda &&
            productosFiltrados.map(producto => (
              <div
                key={producto.id}
                onClick={() =>
                  agregarAlCarrito(producto)
                }
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  marginBottom: "8px",
                  cursor: "pointer"
                }}
              >

                <strong>
                  {producto.nombre}
                </strong>

                <br />

                Código: {producto.codigo}

                <br />

                Código de barras:{" "}
                {producto.codigo_barras || "-"}

                <br />

                Stock: {producto.stock}

                <br />

                Precio: $
                {Number(
                  producto.precio_venta
                ).toLocaleString("es-AR")}

              </div>
            ))}

        </div>

        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "10px"
          }}
        >

          <h2>🛒 Carrito</h2>

          {carrito.length === 0 && (
            <p>
              No hay productos agregados.
            </p>
          )}

          {carrito.map(item => (
            <div
              key={item.producto_id}
              style={{
                borderBottom:
                  "1px solid #ddd",
                padding: "10px 0"
              }}
            >

              <strong>
                {item.nombre}
              </strong>

              <br />

              Código: {item.codigo}

              <br />

              <input
                type="number"
                min="1"
                value={item.cantidad}
                onChange={e =>
                  cambiarCantidad(
                    item.producto_id,
                    e.target.value
                  )
                }
                style={{
                  width: "70px",
                  marginRight: "10px"
                }}
              />

              $
              {Number(
                item.subtotal
              ).toLocaleString("es-AR")}

              <button
                onClick={() =>
                  eliminarDelCarrito(
                    item.producto_id
                  )
                }
                style={{
                  marginLeft: "10px"
                }}
              >
                🗑️
              </button>

            </div>
          ))}

          <hr />

          <h2>
            TOTAL: $
            {total.toLocaleString("es-AR")}
          </h2>

          <label>
            Cliente
          </label>

          <select
            value={clienteId}
            onChange={e =>
              setClienteId(e.target.value)
            }
            style={{
              width: "100%",
              padding: "12px",
              margin: "8px 0"
            }}
          >

            <option value="">
              Seleccionar cliente
            </option>

            {clientes.map(cliente => (
              <option
                key={cliente.id}
                value={cliente.id}
              >
                {cliente.nombre}{" "}
                {cliente.apellido}
              </option>
            ))}

          </select>

          <label>
            Medio de pago
          </label>

          <select
            value={metodoPago}
            onChange={e =>
              setMetodoPago(e.target.value)
            }
            style={{
              width: "100%",
              padding: "12px",
              margin: "8px 0 15px"
            }}
          >

            <option value="Efectivo">
              💵 Efectivo
            </option>

            <option value="Tarjeta de débito">
              💳 Tarjeta de débito
            </option>

            <option value="Tarjeta de crédito">
              💳 Tarjeta de crédito
            </option>

            <option value="Transferencia">
              📱 Transferencia
            </option>

            <option value="Mercado Pago">
              🟡 Mercado Pago
            </option>

          </select>

          <button
            onClick={realizarVenta}
            disabled={
              cargando ||
              carrito.length === 0
            }
            style={{
              width: "100%",
              padding: "15px",
              fontSize: "18px",
              cursor: cargando
                ? "not-allowed"
                : "pointer"
            }}
          >
            {cargando
              ? "Procesando..."
              : "💰 REALIZAR VENTA"}
          </button>

        </div>

      </div>

      <div
        style={{
          marginTop: "30px",
          background: "#fff",
          padding: "20px"
        }}
      >

        <h2>📋 Historial de ventas</h2>

        <table
          border="1"
          cellPadding="8"
          style={{
            width: "100%",
            borderCollapse:
              "collapse"
          }}
        >

          <thead>

            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Medio de pago</th>
              <th>Total</th>
            </tr>

          </thead>

          <tbody>

            {ventas.map(venta => (
              <tr key={venta.id}>

                <td>
                  #{venta.id}
                </td>

                <td>
                  {venta.cliente_id || "-"}
                </td>

                <td>
                  {venta.metodo_pago || "-"}
                </td>

                <td>
                  $
                  {Number(
                    venta.total || 0
                  ).toLocaleString("es-AR")}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}
