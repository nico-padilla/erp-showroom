function App() {
  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>María Paz Showroom ERP</h1>

      <h2>Panel de control</h2>

      <div>
        <button>Productos</button>
        <button>Stock</button>
        <button>Ventas</button>
        <button>Clientes</button>
      </div>

      <hr />

      <h3>Resumen</h3>

      <p>Productos cargados: 0</p>
      <p>Ventas del día: $0</p>
      <p>Clientes registrados: 0</p>
    </div>
  )
}

export default App
