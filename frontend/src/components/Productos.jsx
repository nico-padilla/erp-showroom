import { useEffect, useState } from "react"
import ProductoForm from "./ProductoForm"
import CodigoBarras from "./CodigoBarras"

const API =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000"

function Productos() {
  const [productos, setProductos] = useState([])
  const [editando, setEditando] = useState(null)
  const [busqueda, setBusqueda] = useState("")
  const [mostrarCodigo, setMostrarCodigo] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    cargarProductos()
  }, [])

  async function cargarProductos() {
    try {
      setCargando(true)
      setError("")

      const respuesta = await fetch(`${API}/productos/`)

      if (!respuesta.ok) {
        throw new Error(
          `Error del servidor: ${respuesta.status}`
        )
      }

      const data = await respuesta.json()

      setProductos(
        Array.isArray(data) ? data : []
      )

    } catch (error) {
      console.error(
        "Error cargando productos:",
        error
      )

      setError(
        error.message ||
        "No se pudieron cargar los productos"
      )

    } finally {
      setCargando(false)
    }
  }

  async function agregarProducto(nuevo) {
    try {
      const respuesta = await fetch(
        `${API}/productos/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(nuevo)
        }
      )

      if (!respuesta.ok) {
        const errorData =
          await respuesta.json().catch(() => ({}))

        throw new Error(
          errorData.detail ||
          "Error creando producto"
        )
      }

      await respuesta.json()

      await cargarProductos()

    } catch (error) {
      console.error(
        "Error creando producto:",
        error
      )

      alert(error.message)
    }
  }

  async function eliminarProducto(id) {
    if (
      !window.confirm(
        "¿Eliminar este producto?"
      )
    ) {
      return
    }

    try {
      const respuesta = await fetch(
        `${API}/productos/${id}`,
        {
          method: "DELETE"
        }
      )

      if (!respuesta.ok) {
        const errorData =
          await respuesta.json().catch(() => ({}))

        throw new Error(
          errorData.detail ||
          "No se pudo eliminar"
        )
      }

      await cargarProductos()

    } catch (error) {
      console.error(
        "Error eliminando producto:",
        error
      )

      alert(error.message)
    }
  }

  async function guardarEdicion() {
    if (!editando) {
      return
    }

    try {
      const respuesta = await fetch(
        `${API}/productos/${editando.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(editando)
        }
      )

      if (!respuesta.ok) {
        const errorData =
          await respuesta.json().catch(() => ({}))

        throw new Error(
          errorData.detail ||
          "No se pudo actualizar el producto"
        )
      }

      await respuesta.json()

      setEditando(null)

      await cargarProductos()

    } catch (error) {
      console.error(
        "Error actualizando producto:",
        error
      )

      alert(error.message)
    }
  }

  const productosFiltrados =
    productos.filter((producto) => {
      const texto =
        busqueda.toLowerCase()

      return (
        String(producto.codigo || "")
          .toLowerCase()
          .includes(texto) ||

        String(producto.codigo_barras || "")
          .toLowerCase()
          .includes(texto) ||

        String(producto.nombre || "")
          .toLowerCase()
          .includes(texto) ||

        String(producto.categoria || "")
          .toLowerCase()
          .includes(texto) ||

        String(producto.marca || "")
          .toLowerCase()
          .includes(texto)
      )
    })

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-3xl font-bold">
            Productos
          </h1>

          <p className="text-gray-500">
            Gestión de productos e inventario
          </p>
        </div>

        <button
          onClick={cargarProductos}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          🔄 Actualizar
        </button>

      </div>

      <ProductoForm
        onGuardar={agregarProducto}
      />

      <div className="bg-white rounded-lg shadow p-5 mt-6">

        <div className="mb-4">

          <input
            type="text"
            placeholder="Buscar por código, nombre, categoría o marca..."
            value={busqueda}
            onChange={(e) =>
              setBusqueda(e.target.value)
            }
            className="w-full border rounded-lg px-4 py-3"
          />

        </div>

        {cargando && (
          <div className="text-center py-6">
            Cargando productos...
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            ❌ {error}

            <div className="text-sm mt-2">
              API: {API}
            </div>
          </div>
        )}

        {!cargando &&
          !error &&
          productosFiltrados.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No hay productos para mostrar.
            </div>
          )}

        {!cargando &&
          productosFiltrados.length > 0 && (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="text-left p-3">
                    Código
                  </th>

                  <th className="text-left p-3">
                    Producto
                  </th>

                  <th className="text-left p-3">
                    Categoría
                  </th>

                  <th className="text-left p-3">
                    Talle
                  </th>

                  <th className="text-left p-3">
                    Color
                  </th>

                  <th className="text-right p-3">
                    Precio
                  </th>

                  <th className="text-right p-3">
                    Stock
                  </th>

                  <th className="text-center p-3">
                    Acciones
                  </th>

                </tr>

              </thead>

              <tbody>

                {productosFiltrados.map(
                  (producto) => (

                    <tr
                      key={producto.id}
                      className="border-b hover:bg-gray-50"
                    >

                      <td className="p-3">
                        {producto.codigo}
                      </td>

                      <td className="p-3 font-medium">
                        {producto.nombre}
                      </td>

                      <td className="p-3">
                        {producto.categoria}
                      </td>

                      <td className="p-3">
                        {producto.talle}
                      </td>

                      <td className="p-3">
                        {producto.color}
                      </td>

                      <td className="p-3 text-right">
                        $
                        {Number(
                          producto.precio_venta || 0
                        ).toLocaleString(
                          "es-AR"
                        )}
                      </td>

                      <td className="p-3 text-right">
                        <span
                          className={
                            Number(producto.stock) <=
                            Number(producto.stock_minimo)
                              ? "text-red-600 font-bold"
                              : "text-green-600"
                          }
                        >
                          {producto.stock}
                        </span>
                      </td>

                      <td className="p-3">

                        <div className="flex gap-2 justify-center">

                          <button
                            onClick={() =>
                              setMostrarCodigo(
                                producto
                              )
                            }
                            className="bg-blue-600 text-white px-3 py-1 rounded"
                          >
                            📊
                          </button>

                          <button
                            onClick={() =>
                              setEditando({
                                ...producto
                              })
                            }
                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                          >
                            ✏️
                          </button>

                          <button
                            onClick={() =>
                              eliminarProducto(
                                producto.id
                              )
                            }
                            className="bg-red-600 text-white px-3 py-1 rounded"
                          >
                            🗑️
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {mostrarCodigo && (
        <CodigoBarras
          producto={mostrarCodigo}
          onCerrar={() =>
            setMostrarCodigo(null)
          }
        />
      )}

      {editando && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">

            <h2 className="text-2xl font-bold mb-4">
              Editar producto
            </h2>

            <div className="grid grid-cols-2 gap-4">

              {[
                ["codigo", "Código"],
                ["codigo_barras", "Código de barras"],
                ["nombre", "Nombre"],
                ["descripcion", "Descripción"],
                ["categoria", "Categoría"],
                ["marca", "Marca"],
                ["talle", "Talle"],
                ["color", "Color"],
                ["precio_compra", "Precio compra"],
                ["precio_venta", "Precio venta"],
                ["stock", "Stock"],
                ["stock_minimo", "Stock mínimo"]
              ].map(
                ([campo, etiqueta]) => (

                  <div key={campo}>

                    <label className="block text-sm font-medium mb-1">
                      {etiqueta}
                    </label>

                    <input
                      type={
                        [
                          "precio_compra",
                          "precio_venta",
                          "stock",
                          "stock_minimo"
                        ].includes(campo)
                          ? "number"
                          : "text"
                      }
                      value={
                        editando[campo] ?? ""
                      }
                      onChange={(e) =>
                        setEditando({
                          ...editando,
                          [campo]:
                            e.target.value
                        })
                      }
                      className="w-full border rounded px-3 py-2"
                    />

                  </div>

                )
              )}

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() =>
                  setEditando(null)
                }
                className="px-4 py-2 border rounded"
              >
                Cancelar
              </button>

              <button
                onClick={guardarEdicion}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Guardar cambios
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}

export default Productos
