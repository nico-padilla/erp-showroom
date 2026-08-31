import { NavLink } from "react-router-dom"
import "../styles/sidebar.css"

const menuItems = [
  { to: "/", icon: "🏠", label: "Dashboard", end: true },
  { to: "/productos", icon: "👗", label: "Productos" },
  { to: "/stock", icon: "📦", label: "Stock" },
  { to: "/entrada-stock", icon: "📥", label: "Entrada de stock" },
  { to: "/ventas", icon: "🛒", label: "Ventas" },
  { to: "/clientes", icon: "👥", label: "Clientes" },
  { to: "/caja", icon: "💰", label: "Caja" },
  { to: "/reportes", icon: "📊", label: "Reportes" },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">👗</div>
        <div className="sidebar-title">María Paz</div>
        <div className="sidebar-subtitle">ERP Showroom</div>
      </div>
      <div className="sidebar-divider" />
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-footer-title">ERP Showroom</div>
        <div className="sidebar-footer-version">MVP · v1.0</div>
      </div>
    </aside>
  )
}
