import { useEffect, useState } from "react"

const API = import.meta.env.VITE_API_URL

export default function Stock() {
  const [productos, setProductos] = useState([])
  const [movimientos, setMovimientos] = useState([])

  const [busqueda, setBusqueda] = useState("")
  const [productoSeleccionado, setProductoSeleccionado] =
    useState(null)

  const [tipoMovimiento, setTipoMovimiento] =
    useState("entrada")

  const [cantidad, setCantidad] = useState(1)
  const [motivo, setMotivo] = useState("")

  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")
  const [mensaje, setMensaje] = useState("")

  useEffect(() => {
    cargarProductos()
    cargarMovimientos()
  }, [])

  async function cargarProductos() {
    try {
      const res = await fetch(`${API}/productos/`)

      if (!res.ok) {
        throw new Error(
          "No se pudieron cargar los productos"
        )
      }

      const data = await res.json()

      setProductos(
        Array.isArray(data) ? data : []
      )
    } catch (error) {
      console.error(error)
      setError(error.message)
    }
  }

  async function cargarMovimientos() {
    try {
      const res = await fetch(`${API}/stock/`)

      if (!res.ok) {
        throw new Error(
          "No se pudieron cargar los movimientos"
        )
      }

      const data = await res.json()

      setMovimientos(
        Array.isArray(data) ? data : []
      )
    } catch (error) {
      console.error(error)
    }
  }

  const productosFiltrados = productos.filter(
    (producto) => {
      const texto = String(
        busqueda || ""
      ).toLowerCase()

      return (
        String(producto.nombre || "")
          .toLowerCase()
          .includes(texto) ||
        String(producto.codigo || "")
          .toLowerCase()
          .includes(texto) ||
        String(producto.codigo_barras || "")
          .toLowerCase()
          .includes(texto)
      )
    }
  )

  function seleccionarProducto(producto) {
    setProductoSeleccionado(producto)
    setBusqueda(producto.nombre)
    setError("")
    setMensaje("")
  }

  async function registrarMovimiento() {
    if (!productoSeleccionado) {
      setError(
        "Primero seleccioná un producto."
      )
      return
    }

    const cantidadNumero = Number(cantidad)

    if (
      !cantidadNumero ||
      cantidadNumero <= 0
    ) {
      setError(
        "La cantidad debe ser mayor a 0."
      )
      return
    }

    if (
      tipoMovimiento === "salida" &&
      cantidadNumero >
        Number(productoSeleccionado.stock)
    ) {
      setError(
        `No hay suficiente stock. Disponible: ${productoSeleccionado.stock}`
      )
      return
    }

    if (!motivo.trim()) {
      setError(
        "Ingresá el motivo del movimiento."
      )
      return
    }

    try {
      setCargando(true)
      setError("")
      setMensaje("")

      const respuesta = await fetch(
        `${API}/stock/${tipoMovimiento}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            producto_id:
              productoSeleccionado.id,
            cantidad: cantidadNumero,
            motivo: motivo.trim(),
          }),
        }
      )

      const data =
        await respuesta.json().catch(
          () => ({})
        )

      if (!respuesta.ok) {
        throw new Error(
          data.detail ||
            "No se pudo registrar el movimiento."
        )
      }

      setMensaje(
        tipoMovimiento === "entrada"
          ? "Entrada registrada correctamente ✅"
          : "Salida registrada correctamente ✅"
      )

      setCantidad(1)
      setMotivo("")
      setProductoSeleccionado(null)
      setBusqueda("")

      await cargarProductos()
      await cargarMovimientos()
    } catch (error) {
      console.error(error)
      setError(error.message)
    } finally {
      setCargando(false)
    }
  }

  const productosStockBajo =
    productos.filter(
      (producto) =>
        Number(producto.stock) <=
        Number(producto.stock_minimo || 0)
    )

  const productosStockOK =
    productos.filter(
      (producto) =>
        Number(producto.stock) >
        Number(producto.stock_minimo || 0)
    )

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      <h1>📦 Control de Stock</h1>

      {mensaje && (
        <div
          style={{
            background: "#dcfce7",
            color: "#166534",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "15px",
            fontWeight: "bold",
          }}
        >
          {mensaje}
        </div>
      )}

      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "15px",
          }}
        >
          {error}
        </div>
      )}

      {/* REGISTRAR MOVIMIENTO */}

      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)",
          marginBottom: "24px",
        }}
      >
        <h2>
          Registrar movimiento
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 180px 150px",
            gap: "12px",
            alignItems: "end",
          }}
        >
          {/* PRODUCTO */}

          <div
            style={{
              position: "relative",
            }}
          >
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "6px",
              }}
            >
              Producto
            </label>

            <input
              type="text"
              placeholder="Buscar por nombre, código o código de barras..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(
                  e.target.value
                )
                setProductoSeleccionado(
                  null
                )
              }}
              style={{
                width: "100%",
                padding: "11px",
                border:
                  "1px solid #ccc",
                borderRadius: "7px",
                boxSizing: "border-box",
              }}
            />

            {busqueda &&
              !productoSeleccionado && (
                <div
                  style={{
                    position:
                      "absolute",
                    top: "72px",
                    left: 0,
                    right: 0,
                    background: "#fff",
                    border:
                      "1px solid #ddd",
                    borderRadius:
                      "7px",
                    zIndex: 20,
                    maxHeight:
                      "250px",
                    overflowY:
                      "auto",
                    boxShadow:
                      "0 4px 10px rgba(0,0,0,0.15)",
                  }}
                >
                  {productosFiltrados.map(
                    (producto) => (
                      <div
                        key={
                          producto.id
                        }
                        onClick={() =>
                          seleccionarProducto(
                            producto
                          )
                        }
                        style={{
                          padding:
                            "12px",
                          cursor:
                            "pointer",
                          borderBottom:
                            "1px solid #eee",
                        }}
                      >
                        <strong>
                          {
                            producto.nombre
                          }
                        </strong>

                        <div
                          style={{
                            fontSize:
                              "12px",
                            color:
                              "#666",
                          }}
                        >
                          Código:{" "}
                          {
                            producto.codigo
                          }
                          {" | "}
                          Stock:{" "}
                          {
                            producto.stock
                          }
                        </div>
                      </div>
                    )
                  )}

                  {productosFiltrados.length ===
                    0 && (
                    <div
                      style={{
                        padding:
                          "12px",
                        color:
                          "#777",
                      }}
                    >
                      No se encontraron
                      productos.
                    </div>
                  )}
                </div>
              )}
          </div>

          {/* TIPO */}

          <div>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "6px",
              }}
            >
              Movimiento
            </label>

            <select
              value={tipoMovimiento}
              onChange={(e) =>
                setTipoMovimiento(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "11px",
                border:
                  "1px solid #ccc",
                borderRadius: "7px",
              }}
            >
              <option value="entrada">
                🟢 Entrada
              </option>

              <option value="salida">
                🔴 Salida
              </option>
            </select>
          </div>

          {/* CANTIDAD */}

          <div>
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "6px",
              }}
            >
              Cantidad
            </label>

            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(e) =>
                setCantidad(
                  Number(
                    e.target.value
                  )
                )
              }
              style={{
                width: "100%",
                padding: "11px",
                border:
                  "1px solid #ccc",
                borderRadius: "7px",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* PRODUCTO SELECCIONADO */}

        {productoSeleccionado && (
          <div
            style={{
              marginTop: "15px",
              padding: "12px",
              background:
                "#f3f4f6",
              borderRadius: "8px",
            }}
          >
            <strong>
              Producto seleccionado:
            </strong>{" "}
            {
              productoSeleccionado.nombre
            }

            <span
              style={{
                marginLeft: "15px",
              }}
            >
              Stock actual:{" "}
              <strong>
                {
                  productoSeleccionado.stock
                }
              </strong>
            </span>
          </div>
        )}

        {/* MOTIVO */}

        <div
          style={{
            marginTop: "15px",
          }}
        >
          <label
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "6px",
            }}
          >
            Motivo
          </label>

          <input
            type="text"
            placeholder="Ej: Ingreso proveedor, ajuste, devolución..."
            value={motivo}
            onChange={(e) =>
              setMotivo(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "11px",
              border:
                "1px solid #ccc",
              borderRadius: "7px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          onClick={
            registrarMovimiento
          }
          disabled={cargando}
          style={{
            marginTop: "15px",
            padding:
              "12px 20px",
            border: "none",
            borderRadius: "7px",
            background:
              tipoMovimiento ===
              "entrada"
                ? "#16a34a"
                : "#dc2626",
            color: "#fff",
            fontWeight: "bold",
            cursor: cargando
              ? "not-allowed"
              : "pointer",
          }}
        >
          {cargando
            ? "Procesando..."
            : tipoMovimiento ===
              "entrada"
            ? "📥 Registrar entrada"
            : "📤 Registrar salida"}
        </button>
      </div>

      {/* RESUMEN DE STOCK */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <div>📦 Productos</div>

          <h2
            style={{
              margin: "8px 0 0",
            }}
          >
            {productos.length}
          </h2>
        </div>

        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "20px",
            borderRadius: "12px",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <div>⚠️ Stock bajo</div>

          <h2
            style={{
              margin: "8px 0 0",
            }}
          >
            {
              productosStockBajo.length
            }
          </h2>
        </div>

        <div
          style={{
            background: "#dcfce7",
            color: "#166534",
            padding: "20px",
            borderRadius: "12px",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <div>✅ Stock OK</div>

          <h2
            style={{
              margin: "8px 0 0",
            }}
          >
            {
              productosStockOK.length
            }
          </h2>
        </div>
      </div>

      {/* STOCK ACTUAL */}

      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)",
          marginBottom: "24px",
        }}
      >
        <h2>
          Stock actual
        </h2>

        <div
          style={{
            overflowX:
              "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse:
                "collapse",
            }}
          >
            <thead>
              <tr>
                <th style={th}>
                  Código
                </th>

                <th style={th}>
                  Producto
                </th>

                <th style={th}>
                  Talle
                </th>

                <th style={th}>
                  Color
                </th>

                <th style={th}>
                  Stock
                </th>

                <th style={th}>
                  Mínimo
                </th>

                <th style={th}>
                  Estado
                </th>
              </tr>
            </thead>

            <tbody>
              {productos
                .filter(
                  (producto) => {
                    const texto =
                      String(
                        busqueda || ""
                      ).toLowerCase()

                    return (
                      !texto ||
                      String(
                        producto.nombre ||
                          ""
                      )
                        .toLowerCase()
                        .includes(
                          texto
                        ) ||
                      String(
                        producto.codigo ||
                          ""
                      )
                        .toLowerCase()
                        .includes(
                          texto
                        ) ||
                      String(
                        producto.codigo_barras ||
                          ""
                      )
                        .toLowerCase()
                        .includes(
                          texto
                        )
                    )
                  }
                )
                .map(
                  (producto) => {
                    const bajo =
                      Number(
                        producto.stock
                      ) <=
                      Number(
                        producto.stock_minimo ||
                          0
                      )

                    return (
                      <tr
                        key={
                          producto.id
                        }
                      >
                        <td style={td}>
                          {
                            producto.codigo
                          }
                        </td>

                        <td style={td}>
                          {
                            producto.nombre
                          }
                        </td>

                        <td style={td}>
                          {
                            producto.talle ||
                              "-"
                          }
                        </td>

                        <td style={td}>
                          {
                            producto.color ||
                              "-"
                          }
                        </td>

                        <td
                          style={{
                            ...td,
                            fontWeight:
                              "bold",
                            color: bajo
                              ? "#dc2626"
                              : "#15803d",
                          }}
                        >
                          {
                            producto.stock
                          }
                        </td>

                        <td style={td}>
                          {
                            producto.stock_minimo ??
                              0
                          }
                        </td>

                        <td style={td}>
                          {bajo ? (
                            <span
                              style={{
                                background:
                                  "#fee2e2",
                                color:
                                  "#991b1b",
                                padding:
                                  "5px 8px",
                                borderRadius:
                                  "6px",
                                fontWeight:
                                  "bold",
                              }}
                            >
                              ⚠️ Bajo
                            </span>
                          ) : (
                            <span
                              style={{
                                background:
                                  "#dcfce7",
                                color:
                                  "#166534",
                                padding:
                                  "5px 8px",
                                borderRadius:
                                  "6px",
                                fontWeight:
                                  "bold",
                              }}
                            >
                              ✓ OK
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  }
                )}
            </tbody>
          </table>
        </div>
      </div>

      {/* HISTORIAL */}

      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <h2>
          📋 Historial de movimientos
        </h2>

        {movimientos.length ===
        0 ? (
          <p
            style={{
              color: "#777",
            }}
          >
            Todavía no hay
            movimientos registrados.
          </p>
        ) : (
          <div
            style={{
              overflowX:
                "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse",
              }}
            >
              <thead>
                <tr>
                  <th style={th}>
                    ID
                  </th>

                  <th style={th}>
                    Producto
                  </th>

                  <th style={th}>
                    Tipo
                  </th>

                  <th style={th}>
                    Cantidad
                  </th>

                  <th style={th}>
                    Motivo
                  </th>

                  <th style={th}>
                    Fecha
                  </th>
                </tr>
              </thead>

              <tbody>
                {movimientos
                  .slice()
                  .reverse()
                  .map(
                    (movimiento) => (
                      <tr
                        key={
                          movimiento.id
                        }
                      >
                        <td style={td}>
                          {
                            movimiento.id
                          }
                        </td>

                        <td style={td}>
                          {movimiento.producto
                            ? movimiento
                                .producto
                                .nombre
                            : "Producto eliminado"}
                        </td>

                        <td style={td}>
                          {movimiento.tipo ===
                          "entrada" ? (
                            <span
                              style={{
                                color:
                                  "#15803d",
                                fontWeight:
                                  "bold",
                              }}
                            >
                              🟢 Entrada
                            </span>
                          ) : (
                            <span
                              style={{
                                color:
                                  "#dc2626",
                                fontWeight:
                                  "bold",
                              }}
                            >
                              🔴 Salida
                            </span>
                          )}
                        </td>

                        <td
                          style={{
                            ...td,
                            fontWeight:
                              "bold",
                          }}
                        >
                          {
                            movimiento.cantidad
                          }
                        </td>

                        <td style={td}>
                          {
                            movimiento.motivo
                          }
                        </td>

                        <td style={td}>
                          {movimiento.fecha
                            ? new Date(
                                movimiento.fecha
                              ).toLocaleString(
                                "es-AR"
                              )
                            : "-"}
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

const th = {
  padding: "10px",
  textAlign: "left",
  borderBottom:
    "2px solid #ddd",
  whiteSpace:
    "nowrap",
}

const td = {
  padding: "10px",
  borderBottom:
    "1px solid #eee",
}
