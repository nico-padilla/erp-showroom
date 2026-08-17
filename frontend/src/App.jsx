import { API } from "./config"
import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Sidebar from "./components/Sidebar"
import Productos from "./components/Productos"
import Clientes from "./components/Clientes"
import Ventas from "./components/Ventas"
import Stock from "./components/Stock"
import Caja from "./components/Caja"
import Reportes from "./components/Reportes"



function Dashboard() {
  const [productos, setProductos] = useState([])
  const [clientes, setClientes] = useState([])
  const [ventas, setVentas] = useState([])

  useEffect(() => {
    cargarDatos()
  }, [])

  async function cargarDatos() {
    try {
      const [
        productosRes,
        clientesRes,
        ventasRes
      ] = await Promise.all([
        fetch(`${API}/productos/`),
        fetch(`${API}/clientes/`),
        fetch(`${API}/ventas/`)
      ])

      const productosData =
        await productosRes.json()

      const clientesData =
        await clientesRes.json()

      const ventasData =
        await ventasRes.json()

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

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-gray-500">
            Productos
          </h2>

          <p className="text-3xl font-bold mt-2">
            {productos.length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-gray-500">
            Clientes
          </h2>

          <p className="text-3xl font-bold mt-2">
            {clientes.length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-gray-500">
            Ventas
          </h2>

          <p className="text-3xl font-bold mt-2">
            {ventas.length}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-gray-500">
            Stock Bajo
          </h2>

          <p className="text-3xl font-bold mt-2">
            {stockBajo.length}
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-gray-500">
            Ventas de hoy
          </h2>

          <p className="text-3xl font-bold mt-2">
            $
            {totalVentasHoy.toLocaleString(
              "es-AR"
            )}
          </p>

          <p className="text-gray-500 mt-2">
            {ventasHoy.length} ventas
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-gray-500">
            Total histórico
          </h2>

          <p className="text-3xl font-bold mt-2">
            $
            {totalVentas.toLocaleString(
              "es-AR"
            )}
          </p>

          <p className="text-gray-500 mt-2">
            {ventas.length} ventas registradas
          </p>
        </div>

      </div>

    </div>
  )
}

function App() {
  return (
    <BrowserRouter>

      <div className="flex min-h-screen bg-gray-100">

        <Sidebar />

        <main className="flex-1">

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

export default App
