import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Sidebar from "./components/Sidebar"
import Productos from "./components/Productos"
import Clientes from "./components/Clientes"
import Ventas from "./components/Ventas"
import Stock from "./components/Stock"
import Caja from "./components/Caja"
import Reportes from "./components/Reportes"

const API = "http://127.0.0.1:8000"

function Dashboard() {
  const [productos, setProductos] = useState([])
  const [clientes, setClientes] = useState([])
  const [ventas, setVentas] = useState([])

  useEffect(() => {
    cargarDatos()
  }, [])

  async function cargarDatos() {
    try {
      const [productosRes, clientesRes, ventasRes] =
        await Promise.all([
          fetch(`${API}/productos/`),
          fetch(`${API}/clientes/`),
          fetch(`${API}/ventas/`)
        ])

      const productosData = await productosRes.json()
      const clientesData = await clientesRes.json()
      const ventasData = await ventasRes.json()

      setProductos(
        Array.isArray(productosData)
          ? productosData
          : []
      )

      setClientes(
        Array.isArray(clientesData)
          ? clientesData
          : []
      )

      setVentas(
        Array.isArray(ventasData)
          ? ventasData
          : []
      )

    } catch (error) {
      console.error(
        "Error cargando dashboard:",
        error
      )
    }
  }

  const stockBajo = productos.filter(
    producto =>
      Number(producto.stock) <=
      Number(producto.stock_minimo)
  )

  const totalVentas = ventas.reduce(
    (total, venta) =>
      total + Number(venta.total || 0),
    0
  )

  const ventasHoy = ventas.filter(venta => {
    if (!venta.fecha) return false

    const fechaVenta =
      new Date(venta.fecha)

    const hoy = new Date()

    return (
      fechaVenta.getDate() === hoy.getDate() &&
      fechaVenta.getMonth() === hoy.getMonth() &&
      fechaVenta.getFullYear() ===
        hoy.getFullYear()
    )
  })

  const totalVentasHoy =
    ventasHoy.reduce(
      (total, venta) =>
        total + Number(venta.total || 0),
      0
    )

  const ultimasVentas =
    [...ventas]
      .sort(
        (a, b) =>
          new Date(b.fecha || 0) -
          new Date(a.fecha || 0)
      )
      .slice(0, 5)

  return (
    <div>

      <h1
        style={{
          marginBottom: "8px",
          color: "#333"
        }}
      >
        👋 Bienvenido a ERP Showroom María Paz
      </h1>

      <p
        style={{
          color: "#666",
          marginBottom: "30px"
        }}
      >
        Resumen general del showroom
      </p>

      {/* TARJETAS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(210px, 1fr))",
          gap: "20px"
        }}
      >

        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "25px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,.08)"
          }}
        >
          <h3>👗 Productos</h3>

          <h1>
            {productos.length}
          </h1>

          <p>
            Productos registrados
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "25px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,.08)"
          }}
        >
          <h3>👥 Clientes</h3>

          <h1>
            {clientes.length}
          </h1>

          <p>
            Clientes registrados
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "25px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,.08)"
          }}
        >
          <h3>🛒 Ventas</h3>

          <h1>
            {ventas.length}
          </h1>

          <p>
            Ventas realizadas
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "25px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,.08)"
          }}
        >
          <h3>⚠️ Stock bajo</h3>

          <h1>
            {stockBajo.length}
          </h1>

          <p>
            Productos para reponer
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "25px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,.08)"
          }}
        >
          <h3>💰 Total vendido</h3>

          <h1>
            $
            {totalVentas.toLocaleString(
              "es-AR"
            )}
          </h1>

          <p>
            Todas las ventas
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "25px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,.08)"
          }}
        >
          <h3>💵 Ventas de hoy</h3>

          <h1>
            $
            {totalVentasHoy.toLocaleString(
              "es-AR"
            )}
          </h1>

          <p>
            {ventasHoy.length} ventas hoy
          </p>
        </div>

      </div>

      {/* STOCK BAJO */}

      <div
        style={{
          background: "#fff",
          marginTop: "30px",
          padding: "25px",
          borderRadius: "12px",
          boxShadow:
            "0 2px 10px rgba(0,0,0,.08)"
        }}
      >

        <h2>
          ⚠️ Productos con stock bajo
        </h2>

        {stockBajo.length === 0 ? (

          <p>
            ✅ No hay productos con stock bajo.
          </p>

        ) : (

          <table
            border="1"
            cellPadding="10"
            style={{
              width: "100%",
              borderCollapse:
                "collapse"
            }}
          >

            <thead>

              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Talle</th>
                <th>Color</th>
                <th>Stock</th>
                <th>Mínimo</th>
              </tr>

            </thead>

            <tbody>

              {stockBajo.map(
                producto => (

                  <tr key={producto.id}>

                    <td>
                      {producto.codigo}
                    </td>

                    <td>
                      {producto.nombre}
                    </td>

                    <td>
                      {producto.talle}
                    </td>

                    <td>
                      {producto.color}
                    </td>

                    <td>
                      <strong>
                        {producto.stock}
                      </strong>
                    </td>

                    <td>
                      {producto.stock_minimo}
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        )}

      </div>

      {/* ÚLTIMAS VENTAS */}

      <div
        style={{
          background: "#fff",
          marginTop: "30px",
          padding: "25px",
          borderRadius: "12px",
          boxShadow:
            "0 2px 10px rgba(0,0,0,.08)"
        }}
      >

        <h2>
          🧾 Últimas ventas
        </h2>

        {ultimasVentas.length === 0 ? (

          <p>
            Todavía no hay ventas.
          </p>

        ) : (

          <table
            border="1"
            cellPadding="10"
            style={{
              width: "100%",
              borderCollapse:
                "collapse"
            }}
          >

            <thead>

              <tr>
                <th>Venta</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Medio de pago</th>
                <th>Total</th>
              </tr>

            </thead>

            <tbody>

              {ultimasVentas.map(
                venta => (

                  <tr key={venta.id}>

                    <td>
                      #{venta.id}
                    </td>

                    <td>
                      {venta.fecha
                        ? new Date(
                            venta.fecha
                          ).toLocaleString(
                            "es-AR"
                          )
                        : "-"}
                    </td>

                    <td>
                      {venta.cliente_id ||
                        "-"}
                    </td>

                    <td>
                      {venta.metodo_pago ||
                        "-"}
                    </td>

                    <td>
                      <strong>
                        $
                        {Number(
                          venta.total || 0
                        ).toLocaleString(
                          "es-AR"
                        )}
                      </strong>
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        )}

      </div>

    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>

      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          background: "#f5f6fa"
        }}
      >

        <Sidebar />

        <main
          style={{
            flex: 1,
            padding: "35px"
          }}
        >

          <Routes>

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/productos"
              element={<Productos />}
            />

            <Route
              path="/clientes"
              element={<Clientes />}
            />

            <Route
              path="/ventas"
              element={<Ventas />}
            />

            <Route
              path="/stock"
              element={<Stock />}
            />

            <Route
              path="/caja"
              element={<Caja />}
            />

            <Route
              path="/reportes"
              element={<Reportes />}
            />

          </Routes>

        </main>

      </div>

    </BrowserRouter>
  )
}
