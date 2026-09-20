import { NavLink } from "react-router-dom"

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
    <aside className="w-64 shrink-0 sticky top-0 h-screen self-start overflow-y-auto bg-white border-r border-tinta/10 flex flex-col p-5">
      <div className="text-center pb-5 border-b border-tinta/10">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-rosa flex items-center justify-center text-2xl">
          👗
        </div>
        <div className="mt-3 text-xl font-extrabold text-tinta">María Paz</div>
        <div className="text-sm text-tinta/60">ERP Showroom</div>
      </div>

      <nav className="flex flex-col gap-1 mt-5 flex-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${
                isActive
                  ? "bg-rosa text-flor"
                  : "text-tinta/80 hover:bg-lila/50"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="text-center text-xs text-tinta/50 pt-4 border-t border-tinta/10">
        <div className="font-semibold">ERP Showroom</div>
        <div>MVP · v1.0</div>
      </div>
    </aside>
  )
}
