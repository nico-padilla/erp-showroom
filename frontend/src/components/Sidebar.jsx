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
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <NavLink
          to="/"
          end
          style={({ isActive }) => ({
            textDecoration: "none",
            color: isActive ? "#fff" : "#333",
            background: isActive ? "#111827" : "#f3f4f6",
            padding: "10px 12px",
            borderRadius: "10px",
            fontWeight: 600,
            textAlign: "center",
            transition: "all 0.2s ease",
          })}
        >
          🏠 Dashboard
        </NavLink>

        <NavLink
          to="/productos"
          style={({ isActive }) => ({
            textDecoration: "none",
            color: isActive ? "#fff" : "#333",
            background: isActive ? "#111827" : "#f3f4f6",
            padding: "10px 12px",
            borderRadius: "10px",
            fontWeight: 600,
            textAlign: "center",
            transition: "all 0.2s ease",
          })}
        >
          👗 Productos
        </NavLink>

        <NavLink
          to="/stock"
          style={({ isActive }) => ({
            textDecoration: "none",
            color: isActive ? "#fff" : "#333",
            background: isActive ? "#111827" : "#f3f4f6",
            padding: "10px 12px",
            borderRadius: "10px",
            fontWeight: 600,
            textAlign: "center",
            transition: "all 0.2s ease",
          })}
        >
          📦 Stock
        </NavLink>

        <NavLink
          to="/ventas"
          style={({ isActive }) => ({
            textDecoration: "none",
            color: isActive ? "#fff" : "#333",
            background: isActive ? "#111827" : "#f3f4f6",
            padding: "10px 12px",
            borderRadius: "10px",
            fontWeight: 600,
            textAlign: "center",
            transition: "all 0.2s ease",
          })}
        >
          🛒 Ventas
        </NavLink>

        <NavLink
          to="/clientes"
          style={({ isActive }) => ({
            textDecoration: "none",
            color: isActive ? "#fff" : "#333",
            background: isActive ? "#111827" : "#f3f4f6",
            padding: "10px 12px",
            borderRadius: "10px",
            fontWeight: 600,
            textAlign: "center",
            transition: "all 0.2s ease",
          })}
        >
          👥 Clientes
        </NavLink>

        <NavLink
          to="/caja"
          style={({ isActive }) => ({
            textDecoration: "none",
            color: isActive ? "#fff" : "#333",
            background: isActive ? "#111827" : "#f3f4f6",
            padding: "10px 12px",
            borderRadius: "10px",
            fontWeight: 600,
            textAlign: "center",
            transition: "all 0.2s ease",
          })}
        >
          💰 Caja
        </NavLink>

        <NavLink
          to="/reportes"
          style={({ isActive }) => ({
            textDecoration: "none",
            color: isActive ? "#fff" : "#333",
            background: isActive ? "#111827" : "#f3f4f6",
            padding: "10px 12px",
            borderRadius: "10px",
            fontWeight: 600,
            textAlign: "center",
            transition: "all 0.2s ease",
            gridColumn: "1 / -1",
          })}
        >
          📊 Reportes
        </NavLink>
      </nav>
    </aside>
  )
}
