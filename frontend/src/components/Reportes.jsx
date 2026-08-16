import { useEffect, useMemo, useState } from "react"

const API =
  import.meta.env.VITE_API_URL ||
  "https://erp-showroom.onrender.com"

export default function Reportes() {
  const [ventas, setVentas] = useState([])
  const [productos, setProductos] = useState([])
  const [movimientosCaja, setMovimientosCaja] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarDatos()
  }, [])

  async function cargarDatos() {
    setCargando(true)

    try {
      const [
        ventasRes,
        productosRes,
        cajaRes,
      ] = await Promise.all([
        fetch(`${API}/ventas/`),
        fetch(`${API}/productos/`),
        fetch(`${API}/caja/`),
      ])

      const ventasTexto = await ventasRes.text()
      const productosTexto = await productosRes.text()
      const cajaTexto = await cajaRes.text()

      let ventasData = []
      let productosData = []
      let cajaData = []

      try {
        ventasData = ventasTexto
          ? JSON.parse(ventasTexto)
          : []
      } catch {
        console.error(
          "Respuesta inválida de ventas:",
          ventasTexto
        )
      }

      try {
        productosData = productosTexto
          ? JSON.parse(productosTexto)
          : []
      } catch {
        console.error(
          "Respuesta inválida de productos:",
          productosTexto
        )
      }

      try {
        cajaData = cajaTexto
          ? JSON.parse(cajaTexto)
          : []
      } catch {
        console.error(
          "Respuesta inválida de caja:",
          cajaTexto
        )
      }

      setVentas(
        Array.isArray(ventasData)
          ? ventasData
          : []
      )

      setProductos(
        Array.isArray(productosData)
          ? productosData
          : []
      )

      setMovimientosCaja(
        Array.isArray(cajaData)
          ? cajaData
          : []
      )

    } catch (error) {
      console.error(
        "Error cargando reportes:",
        error
      )
    } finally {
      setCargando(false)
    }
  }

  const totalVendido = useMemo(() => {
    return ventas.reduce(
      (total, venta) =>
        total + Number(venta.total || 0),
      0
    )
  }, [ventas])

  const cantidadVentas = ventas.length

  const totalIngresos = useMemo(() => {
    return movimientosCaja
      .filter(
        (mov) => mov.tipo === "ingreso"
      )
      .reduce(
        (total, mov) =>
          total + Number(mov.monto || 0),
        0
      )
  }, [movimientosCaja])

  const totalGastos = useMemo(() => {
    return movimientosCaja
      .filter(
        (mov) => mov.tipo === "gasto"
      )
      .reduce(
        (total, mov) =>
          total + Number(mov.monto || 0),
        0
      )
  }, [movimientosCaja])

  const saldoCaja =
    totalIngresos - totalGastos

  const productosStockBajo =
    useMemo(() => {
      return productos.filter(
        (producto) =>
          Number(producto.stock || 0) <=
          Number(
            producto.stock_minimo || 0
          )
      )
    }, [productos])

  function dinero(valor) {
    return new Intl.NumberFormat(
      "es-AR",
      {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0,
      }
    ).format(valor)
  }

  function fecha(valor) {
    if (!valor) return "-"

    return new Date(
      valor
    ).toLocaleString("es-AR")
  }

  if (cargando) {
    return (
      <div>
        <h1>📊 Reportes</h1>
        <p>Cargando información...</p>
      </div>
    )
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1>📊 Reportes</h1>

          <p>
            Resumen general del showroom.
          </p>
        </div>

        <button
          onClick={cargarDatos}
          style={{
            padding: "10px 18px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          🔄 Actualizar
        </button>
      </div>

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
            boxShadow:
              "0 2px 10px rgba(0,0,0,.08)",
          }}
        >
          <h3>💰 Total vendido</h3>

          <h2>
            {dinero(totalVendido)}
          </h2>

          <p>
            {cantidadVentas} ventas
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,.08)",
          }}
        >
          <h3>💵 Ingresos de caja</h3>

          <h2>
            {dinero(totalIngresos)}
          </h2>

          <p>
            Ingresos registrados
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,.08)",
          }}
        >
          <h3>💸 Gastos</h3>

          <h2>
            {dinero(totalGastos)}
          </h2>

          <p>
            Gastos registrados
          </p>
        </div>

        <div
          style={{
            background: "#fff",
            padding: "25px",
            borderRadius: "12px",
            boxShadow:
              "0 2px 10px rgba(0,0,0,.08)",
          }}
        >
          <h3>🏦 Saldo de caja</h3>

          <h2>
            {dinero(saldoCaja)}
          </h2>

          <p>
            Ingresos menos gastos
          </p>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          padding: "25px",
          borderRadius: "12px",
          boxShadow:
            "0 2px 10px rgba(0,0,0,.08)",
          marginBottom: "30px",
        }}
      >
        <h2>
          📦 Productos con stock bajo
        </h2>

        {productosStockBajo.length === 0 ? (
          <p>
            ✅ No hay productos con stock bajo.
          </p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse:
                "collapse",
              marginTop: "15px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px",
                  }}
                >
                  Código
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "10px",
                  }}
                >
                  Producto
                </th>

                <th
                  style={{
                    textAlign: "center",
                    padding: "10px",
                  }}
                >
                  Stock
                </th>

                <th
                  style={{
                    textAlign: "center",
                    padding: "10px",
                  }}
                >
                  Mínimo
                </th>
              </tr>
            </thead>

            <tbody>
              {productosStockBajo.map(
                (producto) => (
                  <tr key={producto.id}>
                    <td
                      style={{
                        padding: "10px",
                      }}
                    >
                      {producto.codigo}
                    </td>

                    <td
                      style={{
                        padding: "10px",
                      }}
                    >
                      {producto.nombre}
                    </td>

                    <td
                      style={{
                        padding: "10px",
                        textAlign:
                          "center",
                      }}
                    >
                      {producto.stock}
                    </td>

                    <td
                      style={{
                        padding: "10px",
                        textAlign:
                          "center",
                      }}
                    >
                      {
                        producto.stock_minimo
                      }
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>

      <div
        style={{
          background: "#fff",
          padding: "25px",
          borderRadius: "12px",
          boxShadow:
            "0 2px 10px rgba(0,0,0,.08)",
          marginBottom: "30px",
        }}
      >
        <h2>🛒 Ventas registradas</h2>

        {ventas.length === 0 ? (
          <p>
            No hay ventas registradas.
          </p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse:
                "collapse",
              marginTop: "15px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px",
                  }}
                >
                  ID
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "10px",
                  }}
                >
                  Fecha
                </th>

                <th
                  style={{
                    textAlign: "center",
                    padding: "10px",
                  }}
                >
                  Cliente
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "10px",
                  }}
                >
                  Medio de pago
                </th>

                <th
                  style={{
                    textAlign: "right",
                    padding: "10px",
                  }}
                >
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {[...ventas]
                .sort(
                  (a, b) =>
                    new Date(
                      b.fecha
                    ) -
                    new Date(
                      a.fecha
                    )
                )
                .map((venta) => (
                  <tr key={venta.id}>
                    <td
                      style={{
                        padding: "10px",
                      }}
                    >
                      #{venta.id}
                    </td>

                    <td
                      style={{
                        padding: "10px",
                      }}
                    >
                      {fecha(
                        venta.fecha
                      )}
                    </td>

                    <td
                      style={{
                        padding: "10px",
                        textAlign:
                          "center",
                      }}
                    >
                      #{venta.cliente_id}
                    </td>

                    <td
                      style={{
                        padding: "10px",
                      }}
                    >
                      {
                        venta.metodo_pago
                      }
                    </td>

                    <td
                      style={{
                        padding: "10px",
                        textAlign:
                          "right",
                      }}
                    >
                      {dinero(
                        venta.total
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>

      <div
        style={{
          background: "#fff",
          padding: "25px",
          borderRadius: "12px",
          boxShadow:
            "0 2px 10px rgba(0,0,0,.08)",
        }}
      >
        <h2>
          💰 Movimientos de caja
        </h2>

        {movimientosCaja.length ===
        0 ? (
          <p>
            No hay movimientos de caja.
          </p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse:
                "collapse",
              marginTop: "15px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px",
                  }}
                >
                  Fecha
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "10px",
                  }}
                >
                  Tipo
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "10px",
                  }}
                >
                  Concepto
                </th>

                <th
                  style={{
                    textAlign: "right",
                    padding: "10px",
                  }}
                >
                  Monto
                </th>
              </tr>
            </thead>

            <tbody>
              {movimientosCaja.map(
                (movimiento) => (
                  <tr
                    key={
                      movimiento.id
                    }
                  >
                    <td
                      style={{
                        padding: "10px",
                      }}
                    >
                      {fecha(
                        movimiento.fecha
                      )}
                    </td>

                    <td
                      style={{
                        padding: "10px",
                      }}
                    >
                      {movimiento.tipo ===
                      "gasto"
                        ? "💸 Gasto"
                        : "💵 Ingreso"}
                    </td>

                    <td
                      style={{
                        padding: "10px",
                      }}
                    >
                      {
                        movimiento.concepto
                      }
                    </td>

                    <td
                      style={{
                        padding: "10px",
                        textAlign:
                          "right",
                      }}
                    >
                      {dinero(
                        movimiento.monto
                      )}
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
