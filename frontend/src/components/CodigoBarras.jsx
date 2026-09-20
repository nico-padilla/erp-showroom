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

        // Barras más gruesas para mejorar la lectura
        width: 2,
        height: 45,

        // No mostramos el texto que genera JsBarcode.
        // Lo ponemos nosotros debajo.
        displayValue: false,

        // Espacio blanco alrededor del código
        margin: 2,
        marginTop: 2,
        marginBottom: 2,
        marginLeft: 2,
        marginRight: 2,
      })
    } catch (error) {
      console.error("Error generando código:", error)
    }
  }, [codigo])

  return (
    <div className="etiqueta-impresion">

      {/* MARCA */}
      <div className="marca">
        MARÍA PAZ BY CHARA
      </div>

      {/* PRODUCTO */}
      <div className="producto">
        {producto?.nombre || "Producto"}
      </div>

      {/* TALLE / COLOR */}
      {(producto?.talle || producto?.color) && (
        <div className="detalle">
          {producto?.talle && `T: ${producto.talle}`}
          {producto?.talle && producto?.color && "  "}
          {producto?.color && producto.color}
        </div>
      )}

      {/* PRECIO */}
      <div className="precio">
        ${Number(producto?.precio_venta || 0).toLocaleString("es-AR")}
      </div>

      {/* CÓDIGO DE BARRAS */}
      <svg
        ref={svgRef}
        className="codigo-barras"
      />

      {/* NÚMERO DEL CÓDIGO */}
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
      : Math.max(
          1,
          Number(cantidadManual || 1)
        )

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

        /* ==================================================
           CONFIGURACIÓN DE IMPRESIÓN
           ETIQUETA: 50 mm x 25 mm
        ================================================== */

        @page {
          size: 50mm 25mm;
          margin: 0;
        }


        /* ==================================================
           PANTALLA
        ================================================== */

        .zona-etiquetas {
          display: none;
        }


        /* ==================================================
           IMPRESIÓN
        ================================================== */

        @media print {

          html,
          body {
            width: 50mm !important;
            height: 25mm !important;

            margin: 0 !important;
            padding: 0 !important;

            overflow: hidden !important;
          }


          /* Ocultar toda la interfaz */
          body > * {
            visibility: hidden !important;
          }


          /* Mostrar solamente las etiquetas */
          .zona-etiquetas {
            display: block !important;
            visibility: visible !important;

            position: absolute !important;

            left: 0 !important;
            top: 0 !important;

            width: 50mm !important;

            margin: 0 !important;
            padding: 0 !important;
          }


          .zona-etiquetas,
          .zona-etiquetas * {
            visibility: visible !important;
          }


          /* ==================================================
             CADA ETIQUETA
          ================================================== */

          .etiqueta-impresion {

            position: relative !important;

            display: block !important;

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

            background: white !important;

            font-family: Arial, Helvetica, sans-serif !important;

            text-align: center !important;

            page-break-after: always !important;
            break-after: page !important;
          }


          .etiqueta-impresion:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }


          /* ==================================================
             MARCA
          ================================================== */

          .marca {

            position: absolute !important;

            left: 1.5mm !important;
            top: 0.8mm !important;

            width: 47mm !important;
            height: 3.5mm !important;

            font-size: 8px !important;

            font-weight: 900 !important;

            line-height: 3.5mm !important;

            margin: 0 !important;
            padding: 0 !important;

            white-space: nowrap !important;

            overflow: hidden !important;

            text-align: center !important;
          }


          /* ==================================================
             NOMBRE DEL PRODUCTO
          ================================================== */

          .producto {

            position: absolute !important;

            left: 1.5mm !important;
            top: 4.5mm !important;

            width: 47mm !important;
            height: 3.5mm !important;

            font-size: 9px !important;

            font-weight: 700 !important;

            line-height: 3.5mm !important;

            margin: 0 !important;
            padding: 0 !important;

            white-space: nowrap !important;

            overflow: hidden !important;

            text-overflow: ellipsis !important;

            text-align: center !important;
          }


          /* ==================================================
             TALLE / COLOR
          ================================================== */

          .detalle {

            position: absolute !important;

            left: 1.5mm !important;
            top: 8.2mm !important;

            width: 47mm !important;
            height: 3mm !important;

            font-size: 8px !important;

            font-weight: 600 !important;

            line-height: 3mm !important;

            margin: 0 !important;
            padding: 0 !important;

            white-space: nowrap !important;

            overflow: hidden !important;

            text-align: center !important;
          }


          /* ==================================================
             PRECIO
          ================================================== */

          .precio {

            position: absolute !important;

            left: 1.5mm !important;
            top: 11.2mm !important;

            width: 47mm !important;
            height: 4mm !important;

            font-size: 12px !important;

            font-weight: 900 !important;

            line-height: 4mm !important;

            margin: 0 !important;
            padding: 0 !important;

            white-space: nowrap !important;

            text-align: center !important;
          }


          /* ==================================================
             CÓDIGO DE BARRAS

             IMPORTANTE:
             - CODE128
             - barras gruesas
             - sin deformación
             - espacio blanco alrededor
          ================================================== */

          .codigo-barras {

            display: block !important;

            position: absolute !important;

            left: 5mm !important;
            top: 15.2mm !important;

            width: 40mm !important;
            height: 6mm !important;

            min-width: 40mm !important;
            max-width: 40mm !important;

            min-height: 6mm !important;
            max-height: 6mm !important;

            margin: 0 !important;
            padding: 0 !important;

            overflow: visible !important;
          }


          /* ==================================================
             NÚMERO DEL CÓDIGO

             Lo ponemos debajo del código de barras.
          ================================================== */

          .numero-codigo {

            position: absolute !important;

            left: 1.5mm !important;
            top: 21.5mm !important;

            width: 47mm !important;
            height: 2.5mm !important;

            font-size: 7px !important;

            font-weight: 700 !important;

            line-height: 2.5mm !important;

            margin: 0 !important;
            padding: 0 !important;

            white-space: nowrap !important;

            text-align: center !important;
          }


          /* ==================================================
             OCULTAR INTERFAZ
          ================================================== */

          .no-imprimir {

            display: none !important;

            visibility: hidden !important;
          }

        }
        `}
      </style>


      {/* ==================================================
          VENTANA DE IMPRESIÓN
      ================================================== */}

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

            {/* STOCK */}

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


            {/* MANUAL */}

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


          {/* CANTIDAD */}

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


          {/* BOTONES */}

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


      {/* ==================================================
          ETIQUETAS
      ================================================== */}

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
