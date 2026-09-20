import { API } from "./config"
import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Sidebar from "./components/Sidebar"
import Productos from "./components/Productos"
import Clientes from "./components/Clientes"
import Ventas from "./components/Ventas"
import Stock from "./components/Stock"
import EntradaStock from "./components/EntradaStock"
import Caja from "./components/Caja"
import Reportes from "./components/Reportes"

function formatoPesos(valor) {
  return `$${Number(valor || 0).toLocaleString("es-AR")}`
}

function Tarjeta({ titulo, valor, detalle, color }) {
  return (
    <div className={`${color} rounded-2xl p-5 shadow-sm`}>
      <h2 className="text-sm font-semibold text-tinta/70">{titulo}</h2>
      <p className="text-3xl font-extrabold mt-2 text-tinta">{valor}</p>
      {detalle && <p className="text-sm text-tinta/60 mt-1">{detalle}</p>}
    </div>
  )
}

function Dashboard() {
  const [productos, setProductos] = useState([])
  const [clientes, setClientes] = useState([])
  const [ventas, setVentas] = useState([])

  useEffect(() => { cargarDatos() }, [])

  async function cargarDatos() {
    try {
      const [productosRes, clientesRes, ventasRes] = await Promise.all([
        fetch(`${API}/productos/`),
        fetch(`${API}/clientes/`),
        fetch(`${API}/ventas/`)
      ])
      const productosData = await productosRes.json()
      const clientesData = await clientesRes.json()
      const ventasData = await ventasRes.json()
      setProductos(Array.isArray(productosData) ? productosData : [])
      setClientes(Array.isArray(clientesData) ? clientesData : [])
      setVentas(Array.isArray(ventasData) ? ventasData : [])
    } catch (error) {
      console.error("Error cargando dashboard:", error)
    }
  }

  const stockBajo = productos.filter(producto => Number(producto.stock) <= Number(producto.stock_minimo))
  const totalVentas = ventas.reduce((total, venta) => total + Number(venta.total || 0), 0)
  const ventasHoy = ventas.filter(venta => {
    if (!venta.fecha) return false
    const fechaVenta = new Date(venta.fecha)
    const hoy = new Date()
    return fechaVenta.getDate() === hoy.getDate() && fechaVenta.getMonth() === hoy.getMonth() && fechaVenta.getFullYear() === hoy.getFullYear()
  })
  const totalVentasHoy = ventasHoy.reduce((total, venta) => total + Number(venta.total || 0), 0)

  const fechaHoy = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long"
  })

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-tinta">Dashboard</h1>
        <p className="text-tinta/60 capitalize">{fechaHoy}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Tarjeta titulo="Ventas de hoy" valor={formatoPesos(totalVentasHoy)} detalle={`${ventasHoy.length} ventas`} color="bg-rosa" />
        <Tarjeta titulo="Total histórico" valor={formatoPesos(totalVentas)} detalle={`${ventas.length} ventas registradas`} color="bg-lila" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <Tarjeta titulo="Productos" valor={productos.length} color="bg-menta" />
        <Tarjeta titulo="Clientes" valor={clientes.length} color="bg-cielo" />
        <Tarjeta titulo="Ventas" valor={ventas.length} color="bg-manteca" />
        <Tarjeta titulo="Stock bajo" valor={stockBajo.length} color="bg-durazno" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-5 mt-6">
        <h2 className="text-lg font-bold mb-3">Productos con stock bajo</h2>

        {stockBajo.length === 0 && (
          <p className="text-tinta/60">Todo en orden por ahora.</p>
        )}

        {stockBajo.slice(0, 6).map(producto => (
          <div
            key={producto.id}
            className="flex items-center justify-between py-2 border-b border-tinta/10 last:border-0"
          >
            <div>
              <p className="font-semibold">{producto.nombre}</p>
              <p className="text-sm text-tinta/60">
                {producto.codigo}
                {producto.talle ? ` · Talle ${producto.talle}` : ""}
                {producto.color ? ` · ${producto.color}` : ""}
              </p>
            </div>
            <span className="bg-durazno rounded-full px-3 py-1 text-sm font-bold">
              Stock: {producto.stock}
            </span>
          </div>
        ))}

        {stockBajo.length > 6 && (
          <p className="text-sm text-tinta/60 mt-3">
            y {stockBajo.length - 6} más. Ver el detalle en Stock.
          </p>
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-crema text-tinta">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/ventas" element={<Ventas />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/entrada-stock" element={<EntradaStock />} />
            <Route path="/caja" element={<Caja />} />
            <Route path="/reportes" element={<Reportes />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
