import { API } from "../config"
import { useEffect, useState } from "react"
import ProductoForm from "./ProductoForm"
import CodigoBarras from "./CodigoBarras"

function EtiquetaMasiva({ producto }) {
  const codigo =
    producto?.codigo_barras ||
    producto?.codigo ||
    ""

  return (
    <div className="etiqueta-masiva">
      <div className="marca-masiva">
        MARÍA PAZ BY CHARA
      </div>

      <div className="producto-masiva">
        {producto?.nombre || "Producto"}
      </div>

      {(producto?.talle || producto?.color) && (
        <div className="detalle-masiva">
          {producto?.talle && `T: ${producto.talle}`}
          {producto?.talle && producto?.color && "  "}
          {producto?.color && producto.color}
        </div>
      )}

      <div className="precio-masiva">
        $
        {Number(
          producto?.precio_venta || 0
        ).toLocaleString("es-AR")}
      </div>

      <div className="codigo-barras-masiva">
        <svg
          data-barcode={codigo}
        />
      </div>

      <div className="numero-codigo-masiva">
        {codigo}
      </div>
    </div>
  )
}

function Productos() {
  const [productos, setProductos] = useState([])
  const [editando, setEditando] = useState(null)
  const [busqueda, setBusqueda] = useState("")
  const [mostrarCodigo, setMostrarCodigo] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")
  const [seleccionados, setSeleccionados] = useState([])
  const [imprimiendoMasivo, setImprimiendoMasivo] = useState(false)

  useEffect(() => {
    cargarProductos()
  }, [])

  useEffect(() => {
    if (!imprimiendoMasivo) return

    const timer = setTimeout(() => {
      const svgs = document.querySelectorAll(
        ".codigo-barras-masiva svg"
      )

      svgs.forEach((svg) => {
        const codigo = svg.dataset.barcode

        if (!codigo) return

        try {
          const JsBarcode =
            window.JsBarcode

          if (JsBarcode) {
            JsBarcode(svg, String(codigo), {
              format: "CODE128",
              width: 1.4,
              height: 38,
              displayValue: false,
              margin: 0
            })
          }
        } catch (error) {
          console.error(
            "Error generando código masivo:",
            error
          )
        }
      })

      setTimeout(() => {
        window.print()

        setTimeout(() => {
          setImprimiendoMasivo(false)
        }, 500)
      }, 150)
    }, 100)

    return () => clearTimeout(timer)
  }, [imprimiendoMasivo])

  async function cargarProductos() {
    try {
      setCargando(true)
      setError("")

      const respuesta = await fetch(
        `${API}/productos/`
      )

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

      setSeleccionados((actuales) =>
        actuales.filter((item) => item !== id)
      )

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

  function toggleSeleccion(id) {
    setSeleccionados((actuales) =>
      actuales.includes(id)
        ? actuales.filter(
            (item) => item !== id
          )
        : [...actuales, id]
    )
  }

  function seleccionarTodos() {
    const idsConStock =
      productosFiltrados
        .filter(
          (producto) =>
            Number(producto.stock || 0) > 0
        )
        .map((producto) => producto.id)

    setSeleccionados(idsConStock)
  }

  function limpiarSeleccion() {
    setSeleccionados([])
  }

  function imprimirSeleccionadas() {
    const productosParaImprimir =
      productos.filter(
        (producto) =>
          seleccionados.includes(producto.id) &&
          Number(producto.stock || 0) > 0
      )

    if (
      productosParaImprimir.length === 0
    ) {
      alert(
        "Seleccioná al menos un producto con stock."
      )
      return
    }

    setImprimiendoMasivo(true)
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

  const productosParaImprimir =
    productos.filter(
      (producto) =>
        seleccionados.includes(producto.id) &&
        Number(producto.stock || 0) > 0
    )

  const cantidadEtiquetasMasivas =
    productosParaImprimir.reduce(
      (total, producto) =>
        total + Number(producto.stock || 0),
      0
    )

  return (
    <>
      <style>
        {`
          .zona-impresion-masiva {
            display: none;
          }

          @page {
            size: 50mm 25mm;
            margin: 0;
          }

          @media print {

            html {
              width: 50mm !important;
              margin: 0 !important;
              padding: 0 !important;
            }

            body {
              width: 50mm !important;
              margin: 0 !important;
              padding: 0 !important;
              overflow: hidden !important;
            }

            body > * {
              visibility: hidden !important;
            }

            .zona-impresion-masiva {
              display: block !important;
              visibility: visible !important;

              position: absolute !important;
              left: 0 !important;
              top: 0 !important;

              width: 50mm !important;

              margin: 0 !important;
              padding: 0 !important;
            }

            .zona-impresion-masiva,
            .zona-impresion-masiva * {
              visibility: visible !important;
            }

            .etiqueta-masiva {
              display: block !important;

              position: relative !important;

              width: 50mm !important;
              height: 25mm !important;

              min-width: 50mm !important;
              max-width: 50mm !important;

              min-height: 25mm !important;
              max-height: 25mm !important;

              box-sizing: border-box !important;

              margin: 0 !important;
              padding: 0 !important;

              overflow: hidden !important;

              page-break-after: always !important;
              break-after: page !important;

              background: white !important;

              font-family:
                Arial,
                Helvetica,
                sans-serif !important;

              text-align: center !important;
            }

            .etiqueta-masiva:last-child {
              page-break-after: auto !important;
              break-after: auto !important;
            }

            .marca-masiva {
              display: block !important;

              position: absolute !important;

              left: 1.5mm !important;
              top: 1mm !important;

              width: 47mm !important;
              height: 4mm !important;

              font-size: 9px !important;
              font-weight: 900 !important;
              line-height: 4mm !important;

              white-space: nowrap !important;
              overflow: hidden !important;

              text-align: center !important;
            }

            .producto-masiva {
              display: block !important;

              position: absolute !important;

              left: 1.5mm !important;
              top: 5.5mm !important;

              width: 47mm !important;
              height: 3mm !important;

              font-size: 10px !important;
              font-weight: 700 !important;
              line-height: 3mm !important;

              white-space: nowrap !important;
              overflow: hidden !important;
              text-overflow: ellipsis !important;

              text-align: center !important;
            }

            .detalle-masiva {
              display: block !important;

              position: absolute !important;

              left: 1.5mm !important;
              top: 10mm !important;

              width: 47mm !important;
              height: 3mm !important;

              font-size: 9px !important;
              font-weight: 600 !important;
              line-height: 3mm !important;

              white-space: nowrap !important;
              overflow: hidden !important;

              text-align: center !important;
            }

            .precio-masiva {
              display: block !important;

              position: absolute !important;

              left: 1.5mm !important;
              top: 15mm !important;

              width: 47mm !important;
              height: 4mm !important;

              font-size: 14px !important;
              font-weight: 900 !important;
              line-height: 4mm !important;

              white-space: nowrap !important;

              text-align: center !important;
            }

            .codigo-barras-masiva {
              position: absolute !important;

              left: 3.5mm !important;
              top: 20mm !important;

              width: 43mm !important;
              height: 4mm !important;

              overflow: hidden !important;
            }

            .codigo-barras-masiva svg {
              display: block !important;

              width: 43mm !important;
              height: 4mm !important;

              margin: 0 !important;
              padding: 0 !important;
            }

            .numero-codigo-masiva {
              display: block !important;

              position: absolute !important;

              left: 0 !important;
              top: 24mm !important;

              width: 50mm !important;
              height: 1mm !important;

              font-size: 5px !important;
              font-weight: 700 !important;
              line-height: 1mm !important;

              text-align: center !important;
            }

            .no-imprimir {
              display: none !important;
              visibility: hidden !important;
            }
          }
        `}
      </style>

      <div className="p-6 no-imprimir">

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

        <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.75fr] gap-6 mb-6">

          <div>
            <ProductoForm
              onGuardar={agregarProducto}
            />
          </div>

          <div className="bg-white rounded-lg shadow p-5 h-fit">

            <h2 className="text-xl font-bold mb-4">
              Resumen
            </h2>

            <div className="space-y-3">

              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">
                  Total
                </span>

                <strong>
                  {productos.length}
                </strong>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">
                  Stock bajo
                </span>

                <strong className="text-red-600">
                  {
                    productos.filter(
                      (producto) =>
                        Number(producto.stock) <=
                        Number(
                          producto.stock_minimo || 0
                        )
                    ).length
                  }
                </strong>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">
                  Con stock
                </span>

                <strong className="text-green-600">
                  {
                    productos.filter(
                      (producto) =>
                        Number(producto.stock) >
                        Number(
                          producto.stock_minimo || 0
                        )
                    ).length
                  }
                </strong>
              </div>

            </div>

          </div>

        </div>

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

          <div className="flex flex-wrap items-center gap-3 mb-4">

            <button
              onClick={seleccionarTodos}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              ☑️ Seleccionar todos
            </button>

            <button
              onClick={limpiarSeleccion}
              className="border px-4 py-2 rounded hover:bg-gray-100"
            >
              Limpiar selección
            </button>

            <button
              onClick={imprimirSeleccionadas}
              disabled={
                seleccionados.length === 0
              }
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
              🖨️ Imprimir seleccionadas (
              {cantidadEtiquetasMasivas}
              )
            </button>

          </div>

          {seleccionados.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">

              <strong>
                {seleccionados.length}
              </strong>{" "}
              productos seleccionados —{" "}

              <strong>
                {cantidadEtiquetasMasivas}
              </strong>{" "}
              etiquetas a imprimir según stock.

            </div>
          )}

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

                      <th className="text-center p-3">
                        <input
                          type="checkbox"
                          checked={
                            productosFiltrados.filter(
                              (producto) =>
                                Number(
                                  producto.stock || 0
                                ) > 0
                            ).length > 0 &&
                            productosFiltrados
                              .filter(
                                (producto) =>
                                  Number(
                                    producto.stock || 0
                                  ) > 0
                              )
                              .every(
                                (producto) =>
                                  seleccionados.includes(
                                    producto.id
                                  )
                              )
                          }
                          onChange={(e) =>
                            e.target.checked
                              ? seleccionarTodos()
                              : limpiarSeleccion()
                          }
                        />
                      </th>

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

                          <td className="p-3 text-center">

                            <input
                              type="checkbox"
                              checked={seleccionados.includes(
                                producto.id
                              )}
                              disabled={
                                Number(
                                  producto.stock || 0
                                ) <= 0
                              }
                              onChange={() =>
                                toggleSeleccion(
                                  producto.id
                                )
                              }
                            />

                          </td>

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
                                Number(
                                  producto.stock
                                ) <=
                                Number(
                                  producto.stock_minimo
                                )
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input
                value={editando.codigo || ""}
                onChange={(e) =>
                  setEditando({
                    ...editando,
                    codigo: e.target.value
                  })
                }
                placeholder="Código"
                className="border rounded px-3 py-2"
              />

              <input
                value={
                  editando.codigo_barras || ""
                }
                onChange={(e) =>
                  setEditando({
                    ...editando,
                    codigo_barras:
                      e.target.value
                  })
                }
                placeholder="Código de barras"
                className="border rounded px-3 py-2"
              />

              <input
                value={editando.nombre || ""}
                onChange={(e) =>
                  setEditando({
                    ...editando,
                    nombre: e.target.value
                  })
                }
                placeholder="Nombre"
                className="border rounded px-3 py-2"
              />

              <input
                value={
                  editando.categoria || ""
                }
                onChange={(e) =>
                  setEditando({
                    ...editando,
                    categoria:
                      e.target.value
                  })
                }
                placeholder="Categoría"
                className="border rounded px-3 py-2"
              />

              <input
                value={editando.talle || ""}
                onChange={(e) =>
                  setEditando({
                    ...editando,
                    talle: e.target.value
                  })
                }
                placeholder="Talle"
                className="border rounded px-3 py-2"
              />

              <input
                value={editando.color || ""}
                onChange={(e) =>
                  setEditando({
                    ...editando,
                    color: e.target.value
                  })
                }
                placeholder="Color"
                className="border rounded px-3 py-2"
              />

              <input
                type="number"
                value={
                  editando.precio_compra || 0
                }
                onChange={(e) =>
                  setEditando({
                    ...editando,
                    precio_compra:
                      Number(e.target.value)
                  })
                }
                placeholder="Precio compra"
                className="border rounded px-3 py-2"
              />

              <input
                type="number"
                value={
                  editando.precio_venta || 0
                }
                onChange={(e) =>
                  setEditando({
                    ...editando,
                    precio_venta:
                      Number(e.target.value)
                  })
                }
                placeholder="Precio venta"
                className="border rounded px-3 py-2"
              />

              <input
                type="number"
                value={
                  editando.stock || 0
                }
                onChange={(e) =>
                  setEditando({
                    ...editando,
                    stock:
                      Number(e.target.value)
                  })
                }
                placeholder="Stock"
                className="border rounded px-3 py-2"
              />

              <input
                type="number"
                value={
                  editando.stock_minimo || 0
                }
                onChange={(e) =>
                  setEditando({
                    ...editando,
                    stock_minimo:
                      Number(e.target.value)
                  })
                }
                placeholder="Stock mínimo"
                className="border rounded px-3 py-2"
              />

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

      {imprimiendoMasivo && (
        <div className="zona-impresion-masiva">

          {productosParaImprimir.flatMap(
            (producto) =>
              Array.from(
                {
                  length: Number(
                    producto.stock || 0
                  )
                },
                (_, index) => (
                  <EtiquetaMasiva
                    key={`${producto.id}-${index}`}
                    producto={producto}
                  />
                )
              )
          )}

        </div>
      )}

    </>
  )
}

export default Productos
