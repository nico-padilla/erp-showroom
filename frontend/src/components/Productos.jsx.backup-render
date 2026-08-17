import { useEffect, useState } from "react"
import ProductoForm from "./ProductoForm"
import CodigoBarras from "./CodigoBarras"

function Productos() {
  const [productos, setProductos] = useState([])
  const [editando, setEditando] = useState(null)
  const [busqueda, setBusqueda] = useState("")
  const [mostrarCodigo, setMostrarCodigo] = useState(null)

  useEffect(() => {
    cargarProductos()
  }, [])

  async function cargarProductos() {
    try {
      const respuesta = await fetch("/productos/")

      if (!respuesta.ok) {
        throw new Error("No se pudieron cargar los productos")
      }

      const data = await respuesta.json()

      setProductos(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error cargando productos:", error)
      alert(error.message)
    }
  }

  async function agregarProducto(nuevo) {
    try {
      const respuesta = await fetch("/productos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevo)
      })

      if (!respuesta.ok) {
        const error = await respuesta.json().catch(() => ({}))

        throw new Error(
          error.detail || "Error creando producto"
        )
      }

      await respuesta.json()

      cargarProductos()
    } catch (error) {
      console.error("Error creando producto:", error)
      alert(error.message)
    }
  }

  async function eliminarProducto(id) {
    if (!window.confirm("¿Eliminar este producto?")) {
      return
    }

    try {
      const respuesta = await fetch(
        `/productos/${id}`,
        {
          method: "DELETE"
        }
      )

      if (!respuesta.ok) {
        const error = await respuesta.json().catch(() => ({}))

        throw new Error(
          error.detail || "No se pudo eliminar"
        )
      }

      cargarProductos()
    } catch (error) {
      console.error("Error eliminando producto:", error)
      alert(error.message)
    }
  }

  async function guardarEdicion() {
    if (!editando) {
      return
    }

    try {
      const respuesta = await fetch(
        `/productos/${editando.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(editando)
        }
      )

      if (!respuesta.ok) {
        const error = await respuesta.json().catch(() => ({}))

        throw new Error(
          error.detail || "Error actualizando producto"
        )
      }

      await respuesta.json()

      setEditando(null)

      cargarProductos()
    } catch (error) {
      console.error("Error editando producto:", error)
      alert(error.message)
    }
  }

  function actualizarCampo(campo, valor) {
    setEditando({
      ...editando,
      [campo]: valor
    })
  }

  const productosFiltrados = productos.filter((producto) => {
    const texto = String(busqueda || "")
      .toLowerCase()
      .trim()

    if (!texto) {
      return true
    }

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
  })

  return (
    <div>

      <h1>📦 Productos</h1>

      <ProductoForm
        agregarProducto={agregarProducto}
      />

      <div
        style={{
          marginBottom: "20px"
        }}
      >
        <input
          type="text"
          placeholder="🔎 Buscar por código, código de barras o nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "600px",
            padding: "12px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "8px"
          }}
        />
      </div>

      <h2>
        Listado de productos
      </h2>

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff"
        }}
      >

        <thead>

          <tr>
            <th>Código</th>
            <th>Código de barras</th>
            <th>Producto</th>
            <th>Talle</th>
            <th>Color</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>

        </thead>

        <tbody>

          {productosFiltrados.map((producto) => (

            <tr key={producto.id}>

              <td>
                {producto.codigo}
              </td>

              <td>
                {producto.codigo_barras || "-"}
              </td>

              <td>
                {producto.nombre}
              </td>

              <td>
                {producto.talle}
              </td>

              <td>
                {producto.color}
              </td>

              <td>
                $
                {Number(
                  producto.precio_venta || 0
                ).toLocaleString("es-AR")}
              </td>

              <td>
                {producto.stock}
              </td>

              <td>

                <button
                  onClick={() =>
                    setMostrarCodigo(
                      mostrarCodigo === producto.id
                        ? null
                        : producto.id
                    )
                  }
                  style={{
                    marginRight: "8px",
                    cursor: "pointer"
                  }}
                >
                  🏷️ Código
                </button>

                <button
                  onClick={() =>
                    setEditando({
                      ...producto
                    })
                  }
                  style={{
                    marginRight: "8px",
                    cursor: "pointer"
                  }}
                >
                  ✏️ Editar
                </button>

                <button
                  onClick={() =>
                    eliminarProducto(producto.id)
                  }
                  style={{
                    cursor: "pointer"
                  }}
                >
                  🗑️ Eliminar
                </button>

                {mostrarCodigo === producto.id && (

                  <div
                    style={{
                      marginTop: "15px",
                      padding: "10px",
                      background: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "8px"
                    }}
                  >

                    {producto.codigo_barras ? (

                      <CodigoBarras
                        codigo={
                          producto.codigo_barras
                        }
                      />

                    ) : (

                      <p>
                        Este producto no tiene
                        código de barras.
                      </p>

                    )}

                  </div>

                )}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {productosFiltrados.length === 0 && (

        <p
          style={{
            marginTop: "20px"
          }}
        >
          No se encontraron productos.
        </p>

      )}

      {editando && (

        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}
        >

          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "12px",
              width: "600px",
              maxWidth: "90%",
              maxHeight: "90vh",
              overflowY: "auto"
            }}
          >

            <h2>
              ✏️ Editar producto
            </h2>

            <label>
              Código
            </label>

            <input
              value={editando.codigo || ""}
              onChange={(e) =>
                actualizarCampo(
                  "codigo",
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "12px"
              }}
            />

            <label>
              Código de barras
            </label>

            <input
              value={
                editando.codigo_barras || ""
              }
              onChange={(e) =>
                actualizarCampo(
                  "codigo_barras",
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "12px"
              }}
            />

            <label>
              Nombre
            </label>

            <input
              value={editando.nombre || ""}
              onChange={(e) =>
                actualizarCampo(
                  "nombre",
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "12px"
              }}
            />

            <label>
              Descripción
            </label>

            <input
              value={
                editando.descripcion || ""
              }
              onChange={(e) =>
                actualizarCampo(
                  "descripcion",
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "12px"
              }}
            />

            <label>
              Categoría
            </label>

            <input
              value={
                editando.categoria || ""
              }
              onChange={(e) =>
                actualizarCampo(
                  "categoria",
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "12px"
              }}
            />

            <label>
              Marca
            </label>

            <input
              value={editando.marca || ""}
              onChange={(e) =>
                actualizarCampo(
                  "marca",
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "12px"
              }}
            />

            <label>
              Talle
            </label>

            <input
              value={editando.talle || ""}
              onChange={(e) =>
                actualizarCampo(
                  "talle",
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "12px"
              }}
            />

            <label>
              Color
            </label>

            <input
              value={editando.color || ""}
              onChange={(e) =>
                actualizarCampo(
                  "color",
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "12px"
              }}
            />

            <label>
              Precio de compra
            </label>

            <input
              type="number"
              value={
                editando.precio_compra ?? ""
              }
              onChange={(e) =>
                actualizarCampo(
                  "precio_compra",
                  Number(e.target.value)
                )
              }
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "12px"
              }}
            />

            <label>
              Precio de venta
            </label>

            <input
              type="number"
              value={
                editando.precio_venta ?? ""
              }
              onChange={(e) =>
                actualizarCampo(
                  "precio_venta",
                  Number(e.target.value)
                )
              }
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "12px"
              }}
            />

            <label>
              Stock
            </label>

            <input
              type="number"
              value={
                editando.stock ?? ""
              }
              onChange={(e) =>
                actualizarCampo(
                  "stock",
                  Number(e.target.value)
                )
              }
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "12px"
              }}
            />

            <label>
              Stock mínimo
            </label>

            <input
              type="number"
              value={
                editando.stock_minimo ?? ""
              }
              onChange={(e) =>
                actualizarCampo(
                  "stock_minimo",
                  Number(e.target.value)
                )
              }
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "12px"
              }}
            />

            <label>
              Imagen
            </label>

            <input
              value={
                editando.imagen || ""
              }
              onChange={(e) =>
                actualizarCampo(
                  "imagen",
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "12px"
              }}
            />

            <div
              style={{
                marginTop: "20px"
              }}
            >

              <button
                onClick={guardarEdicion}
                style={{
                  padding: "12px 20px",
                  marginRight: "10px",
                  cursor: "pointer"
                }}
              >
                💾 Guardar cambios
              </button>

              <button
                onClick={() =>
                  setEditando(null)
                }
                style={{
                  padding: "12px 20px",
                  cursor: "pointer"
                }}
              >
                ❌ Cancelar
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

export default Productos
