import { useEffect, useRef, useState } from "react"
import JsBarcode from "jsbarcode"

function Etiqueta({ producto }) {
  const svgRef = useRef(null)

  const codigo =
    producto?.codigo_barras ||
    producto?.codigo ||
    ""

  useEffect(() => {
    if (!svgRef.current || !codigo) return

    try {
      JsBarcode(svgRef.current, String(codigo), {
        format: "CODE128",
        width: 1.2,
        height: 25,
        displayValue: false,
        margin: 0,
      })
    } catch (error) {
      console.error("Error generando código:", error)
    }
  }, [codigo])

  return (
    <div className="etiqueta-impresion">
      
      <div className="marca">
        MARÍA PAZ BY CHARA
      </div>

      <div className="producto">
        {producto?.nombre || "Producto"}
      </div>

      {(producto?.talle || producto?.color) && (
        <div className="detalle">
          {producto?.talle && `T: ${producto.talle}`}
          {producto?.talle && producto?.color && "  "}
          {producto?.color && producto.color}
        </div>
      )}

      <div className="precio">
        $
        {Number(
          producto?.precio_venta || 0
        ).toLocaleString("es-AR")}
      </div>

      <svg
        ref={svgRef}
        className="codigo-barras"
      />

      <div className="numero-codigo">
        {codigo}
      </div>

    </div>
  )
}


export default function CodigoBarras({
  producto,
  onCerrar
}) {

  const [cantidadManual, setCantidadManual] = useState(
    Number(producto?.stock) > 0
      ? Number(producto.stock)
      : 1
  )

  const [modo, setModo] = useState("stock")

  if (!producto) {
    return null
  }

  const stock = Math.max(
    0,
    Number(producto.stock || 0)
  )

  const cantidad =
    modo === "stock"
      ? stock
      : Math.max(1, Number(cantidadManual || 1))

  const etiquetas = Array.from(
    { length: cantidad },
    (_, i) => i
  )

  function imprimir() {
    window.print()
  }

  return (
    <>
      <style>
        {`
          @page {
  size: 50mm 25mm;
  margin: 0;
}	

          @media print {

            html,
            body {
              width: 50mm !important;
              margin: 0 !important;
              padding: 0 !important;
            }

            body * {
              visibility: hidden !important;
            }

            .zona-etiquetas,
            .zona-etiquetas * {
              visibility: visible !important;
            }

            .zona-etiquetas {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 50mm !important;
              margin: 0 !important;
              padding: 0 !important;
            }

            .etiqueta-impresion {
              width: 50mm !important;
              height: 25mm !important;
              box-sizing: border-box !important;
              margin: 0 !important;
              padding: 1.2mm !important;
              page-break-after: always !important;
              break-after: page !important;
              overflow: hidden !important;
              background: white !important;
            }

            .no-imprimir {
              display: none !important;
            }
          }

          .etiqueta-impresion {
            width: 50mm;
            height: 25mm;
            box-sizing: border-box;
            padding: 1.2mm;
            text-align: center;
            overflow: hidden;
            background: white;
            font-family: Arial, sans-serif;
          }

          .marca {
            font-size: 7px;
            font-weight: bold;
            line-height: 7px;
          }

          .producto {
            font-size: 7px;
            font-weight: bold;
            line-height: 8px;
            margin-top: 0.7mm;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .detalle {
            font-size: 6px;
            line-height: 6px;
            margin-top: 0.3mm;
            white-space: nowrap;
            overflow: hidden;
          }

          .precio {
            font-size: 8px;
            font-weight: bold;
            line-height: 8px;
            margin-top: 0.4mm;
          }

          .codigo-barras {
  width: 46mm !important;
  height: 10mm !important;
  display: block !important;
  margin: 0.5mm auto 0 !important;
}

          .numero-codigo {
            font-size: 6px;
            font-weight: bold;
            line-height: 6px;
            margin-top: 0.2mm;
          }
        `}
      </style>

      {/* CONTROLES */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 no-imprimir">

        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">

          <h2 className="text-xl font-bold mb-4">
            🏷️ Imprimir etiquetas
          </h2>

          <div className="border rounded-lg p-4 mb-4">

            <p className="font-bold">
              {producto.nombre}
            </p>

            <p className="text-sm text-gray-600">
              Código: {producto.codigo_barras || producto.codigo}
            </p>

            <p className="text-sm text-gray-600">
              Stock disponible: {stock}
            </p>

          </div>

          <div className="space-y-3">

            <label className="flex gap-2 items-center">
              <input
                type="radio"
                name="modoEtiqueta"
                checked={modo === "stock"}
                onChange={() => setModo("stock")}
              />

              <span>
                Automático según stock
              </span>
            </label>

            <label className="flex gap-2 items-center">
              <input
                type="radio"
                name="modoEtiqueta"
                checked={modo === "manual"}
                onChange={() => setModo("manual")}
              />

              <span>
                Cantidad manual
              </span>
            </label>

            {modo === "manual" && (
              <input
                type="number"
                min="1"
                value={cantidadManual}
                onChange={(e) =>
                  setCantidadManual(e.target.value)
                }
                className="w-full border rounded px-3 py-2"
              />
            )}

          </div>

          <div className="bg-gray-100 rounded-lg p-3 mt-4 text-center">

            <div className="text-sm text-gray-600">
              Etiquetas a imprimir
            </div>

            <div className="text-3xl font-bold">
              {cantidad}
            </div>

          </div>

          {cantidad === 0 && (
            <p className="text-red-600 text-sm mt-3">
              Este producto no tiene stock.
              Elegí cantidad manual para imprimir.
            </p>
          )}

          <div className="flex justify-end gap-2 mt-5">

            <button
              onClick={onCerrar}
              className="px-4 py-2 border rounded"
            >
              Cancelar
            </button>

            <button
              onClick={imprimir}
              disabled={cantidad <= 0}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
              🖨️ Imprimir {cantidad}
            </button>

          </div>

        </div>
      </div>


      {/* ETIQUETAS QUE SE VAN A IMPRIMIR */}
      <div className="zona-etiquetas">

        {etiquetas.map((_, index) => (
          <Etiqueta
            key={`${producto.id}-${index}`}
            producto={producto}
          />
        ))}

      </div>
    </>
  )
}
