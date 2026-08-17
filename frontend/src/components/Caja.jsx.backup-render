import { useEffect, useState } from "react"

export default function Caja() {
  const [movimientos, setMovimientos] = useState([])
  const [tipo, setTipo] = useState("ingreso")
  const [concepto, setConcepto] = useState("")
  const [monto, setMonto] = useState("")
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    cargarMovimientos()
  }, [])

  async function cargarMovimientos() {
    try {
      const respuesta = await fetch("/caja/")

      if (!respuesta.ok) {
        throw new Error("No se pudieron cargar los movimientos")
      }

      const data = await respuesta.json()
      setMovimientos(data)
    } catch (error) {
      console.error("Error cargando caja:", error)
    }
  }

  async function registrarMovimiento(e) {
    e.preventDefault()

    if (!concepto.trim()) {
      alert("Ingresá un concepto")
      return
    }

    if (!monto || Number(monto) <= 0) {
      alert("Ingresá un monto válido")
      return
    }

    setCargando(true)

    try {
      const respuesta = await fetch("/caja/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tipo: tipo,
          concepto: concepto.trim(),
          monto: Number(monto),
        }),
      })

      const texto = await respuesta.text()

      let data = {}

      if (texto) {
        try {
          data = JSON.parse(texto)
        } catch {
          throw new Error("El servidor respondió con un formato inválido")
        }
      }

      if (!respuesta.ok) {
        throw new Error(
          data.detail || "No se pudo registrar el movimiento"
        )
      }

      setConcepto("")
      setMonto("")

      await cargarMovimientos()

      alert(
        tipo === "ingreso"
          ? "Ingreso registrado correctamente ✅"
          : "Gasto registrado correctamente ✅"
      )
    } catch (error) {
      console.error("Error registrando movimiento:", error)
      alert(error.message)
    } finally {
      setCargando(false)
    }
  }

  const ingresos = movimientos
    .filter((m) => m.tipo === "ingreso")
    .reduce((total, m) => total + Number(m.monto), 0)

  const gastos = movimientos
    .filter((m) => m.tipo === "gasto")
    .reduce((total, m) => total + Number(m.monto), 0)

  const saldo = ingresos - gastos

  // RESUMEN POR MEDIO DE PAGO
  const efectivo = movimientos
    .filter(
      (m) =>
        m.tipo === "ingreso" &&
        m.concepto.toLowerCase().includes("efectivo")
    )
    .reduce((total, m) => total + Number(m.monto), 0)

  const debito = movimientos
    .filter(
      (m) =>
        m.tipo === "ingreso" &&
        (m.concepto.toLowerCase().includes("débito") ||
          m.concepto.toLowerCase().includes("debito"))
    )
    .reduce((total, m) => total + Number(m.monto), 0)

  const credito = movimientos
    .filter(
      (m) =>
        m.tipo === "ingreso" &&
        (m.concepto.toLowerCase().includes("crédito") ||
          m.concepto.toLowerCase().includes("credito"))
    )
    .reduce((total, m) => total + Number(m.monto), 0)

  const transferencia = movimientos
    .filter(
      (m) =>
        m.tipo === "ingreso" &&
        m.concepto.toLowerCase().includes("transferencia")
    )
    .reduce((total, m) => total + Number(m.monto), 0)

  const mercadoPago = movimientos
    .filter(
      (m) =>
        m.tipo === "ingreso" &&
        (m.concepto.toLowerCase().includes("mercado pago") ||
          m.concepto.toLowerCase().includes("mercadopago"))
    )
    .reduce((total, m) => total + Number(m.monto), 0)

  function formatearDinero(valor) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(valor)
  }

  function formatearFecha(fecha) {
    if (!fecha) return "-"

    return new Date(fecha).toLocaleString("es-AR")
  }

  return (
    <div>
      <h1>💰 Caja</h1>

      <p style={{ color: "#666", marginBottom: "25px" }}>
        Control de ingresos, gastos y saldo del showroom.
      </p>

      {/* RESUMEN PRINCIPAL */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,.08)",
          }}
        >
          <h3>💵 Ingresos</h3>

          <h2 style={{ marginBottom: "5px" }}>
            {formatearDinero(ingresos)}
          </h2>

          <p style={{ margin: 0, color: "#666" }}>
            Total ingresado
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,.08)",
          }}
        >
          <h3>💸 Gastos</h3>

          <h2 style={{ marginBottom: "5px" }}>
            {formatearDinero(gastos)}
          </h2>

          <p style={{ margin: 0, color: "#666" }}>
            Total gastado
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 2px 10px rgba(0,0,0,.08)",
          }}
        >
          <h3>🏦 Saldo</h3>

          <h2 style={{ marginBottom: "5px" }}>
            {formatearDinero(saldo)}
          </h2>

          <p style={{ margin: 0, color: "#666" }}>
            Ingresos - gastos
          </p>
        </div>
      </div>

      {/* RESUMEN POR MEDIO DE PAGO */}

      <div
        style={{
          background: "#fff",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,.08)",
          marginBottom: "30px",
        }}
      >
        <h2>💳 Resumen por medio de pago</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              padding: "18px",
              borderRadius: "10px",
              background: "#f8f9fa",
            }}
          >
            <strong>💵 Efectivo</strong>

            <h3>{formatearDinero(efectivo)}</h3>
          </div>

          <div
            style={{
              padding: "18px",
              borderRadius: "10px",
              background: "#f8f9fa",
            }}
          >
            <strong>💳 Débito</strong>

            <h3>{formatearDinero(debito)}</h3>
          </div>

          <div
            style={{
              padding: "18px",
              borderRadius: "10px",
              background: "#f8f9fa",
            }}
          >
            <strong>💳 Crédito</strong>

            <h3>{formatearDinero(credito)}</h3>
          </div>

          <div
            style={{
              padding: "18px",
              borderRadius: "10px",
              background: "#f8f9fa",
            }}
          >
            <strong>📱 Transferencia</strong>

            <h3>{formatearDinero(transferencia)}</h3>
          </div>

          <div
            style={{
              padding: "18px",
              borderRadius: "10px",
              background: "#f8f9fa",
            }}
          >
            <strong>🟡 Mercado Pago</strong>

            <h3>{formatearDinero(mercadoPago)}</h3>
          </div>
        </div>
      </div>

      {/* FORMULARIO */}

      <div
        style={{
          background: "#fff",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,.08)",
          marginBottom: "30px",
        }}
      >
        <h2>➕ Registrar movimiento</h2>

        <form
          onSubmit={registrarMovimiento}
          style={{
            display: "grid",
            gridTemplateColumns:
              "180px 1fr 180px 160px",
            gap: "15px",
            alignItems: "end",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "bold",
              }}
            >
              Tipo
            </label>

            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              style={{
                width: "100%",
                padding: "11px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            >
              <option value="ingreso">
                💵 Ingreso
              </option>

              <option value="gasto">
                💸 Gasto
              </option>
            </select>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "bold",
              }}
            >
              Concepto
            </label>

            <input
              type="text"
              placeholder="Ej: Compra de insumos"
              value={concepto}
              onChange={(e) =>
                setConcepto(e.target.value)
              }
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "11px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "bold",
              }}
            >
              Monto
            </label>

            <input
              type="number"
              min="1"
              step="0.01"
              placeholder="$0"
              value={monto}
              onChange={(e) =>
                setMonto(e.target.value)
              }
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "11px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            style={{
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              cursor: cargando
                ? "not-allowed"
                : "pointer",
              background:
                tipo === "ingreso"
                  ? "#198754"
                  : "#dc3545",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            {cargando
              ? "Guardando..."
              : tipo === "ingreso"
                ? "💵 Registrar ingreso"
                : "💸 Registrar gasto"}
          </button>
        </form>
      </div>

      {/* MOVIMIENTOS */}

      <div
        style={{
          background: "#fff",
          padding: "25px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,.08)",
        }}
      >
        <h2>📋 Movimientos de caja</h2>

        {movimientos.length === 0 ? (
          <p style={{ color: "#666" }}>
            Todavía no hay movimientos registrados.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "15px",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px",
                      borderBottom:
                        "2px solid #ddd",
                    }}
                  >
                    Fecha
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px",
                      borderBottom:
                        "2px solid #ddd",
                    }}
                  >
                    Tipo
                  </th>

                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px",
                      borderBottom:
                        "2px solid #ddd",
                    }}
                  >
                    Concepto
                  </th>

                  <th
                    style={{
                      textAlign: "right",
                      padding: "12px",
                      borderBottom:
                        "2px solid #ddd",
                    }}
                  >
                    Monto
                  </th>
                </tr>
              </thead>

              <tbody>
                {movimientos.map(
                  (movimiento) => (
                    <tr key={movimiento.id}>
                      <td
                        style={{
                          padding: "12px",
                          borderBottom:
                            "1px solid #eee",
                        }}
                      >
                        {formatearFecha(
                          movimiento.fecha
                        )}
                      </td>

                      <td
                        style={{
                          padding: "12px",
                          borderBottom:
                            "1px solid #eee",
                        }}
                      >
                        {movimiento.tipo ===
                        "ingreso"
                          ? "💵 Ingreso"
                          : "💸 Gasto"}
                      </td>

                      <td
                        style={{
                          padding: "12px",
                          borderBottom:
                            "1px solid #eee",
                        }}
                      >
                        {movimiento.concepto}
                      </td>

                      <td
                        style={{
                          padding: "12px",
                          borderBottom:
                            "1px solid #eee",
                          textAlign: "right",
                          fontWeight: "bold",
                        }}
                      >
                        {formatearDinero(
                          movimiento.monto
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
