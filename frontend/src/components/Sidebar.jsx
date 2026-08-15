import { NavLink } from "react-router-dom"
import "../styles/sidebar.css"

export default function Sidebar() {
  return (
    <aside
      style={{
        width: "240px",
        minHeight: "100vh",
        background: "#ffffff",
        padding: "25px 15px",
        boxSizing: "border-box",
        borderRight: "1px solid #e5e5e5",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "25px",
        }}
      >
        <div
          style={{
            fontSize: "32px",
            marginBottom: "5px",
          }}
        >
          👗
        </div>

        <h2
          style={{
            margin: 0,
            color: "#333",
            fontSize: "20px",
          }}
        >
          María Paz
        </h2>

        <p
          style={{
            margin: "5px 0 0",
            color: "#888",
            fontSize: "13px",
          }}
        >
          ERP Showroom
        </p>
      </div>

      <hr />

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginTop: "20px",
        }}
      >
        <NavLink to="/" end>
          🏠 Dashboard
        </NavLink>

        <NavLink to="/productos">
          👗 Productos
        </NavLink>

        <NavLink to="/stock">
          📦 Stock
        </NavLink>

        <NavLink to="/ventas">
          🛒 Ventas
        </NavLink>

        <NavLink to="/clientes">
          👥 Clientes
        </NavLink>

        <NavLink to="/caja">
          💰 Caja
        </NavLink>

        <NavLink to="/reportes">
          📊 Reportes
        </NavLink>
      </nav>
    </aside>
  )
}
