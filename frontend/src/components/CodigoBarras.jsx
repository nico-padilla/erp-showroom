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
  width: 1.4,
  height: 38,
  displayValue: false,
  margin: 0,
})
    } catch (error) {
      console.error("Error generando código:", error)
    }
  }, [codigo])

  return (
    <div className="etiqueta-impresion">

      <div className="contenido-etiqueta">

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
          {Number(producto?.precio_venta || 0).toLocaleString("es-AR")}
        </div>

        <svg
          ref={svgRef}
          className="codigo-barras"
        />

        <div className="numero-codigo">
          {codigo}
        </div>

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

          /* ==========================================
             CONFIGURACIÓN DE LA ETIQUETA
             50 mm ANCHO x 25 mm ALTO
          ========================================== */

          @page {
            size: 50mm 25mm;
            margin: 0;
          }


          /* ==========================================
             PANTALLA
          ========================================== */

          .zona-etiquetas {
            display: none;
          }


          /* ==========================================
             IMPRESIÓN
          ========================================== */

          @media print {

            html {
              width: 50mm !important;
              height: 25mm !important;
              margin: 0 !important;
              padding: 0 !important;
            }

            body {
              width: 50mm !important;
              height: 25mm !important;
              margin: 0 !important;
              padding: 0 !important;
              overflow: hidden !important;
            }

            body > * {
              visibility: hidden !important;
            }

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


            /* ======================================
               CADA ETIQUETA
            ====================================== */

            .etiqueta-impresion {
              display: flex !important;

              flex-direction: column !important;

              justify-content: flex-start !important;
              align-items: center !important;

              width: 50mm !important;
              height: 25mm !important;

              min-width: 50mm !important;
              max-width: 50mm !important;

              min-height: 25mm !important;
              max-height: 25mm !important;

              box-sizing: border-box !important;

              margin: 0 !important;

              padding: 1mm 1.5mm 0.5mm 1.5mm !important;

              overflow: hidden !important;

              page-break-after: always !important;
              break-after: page !important;

              background: white !important;

              font-family: Arial, Helvetica, sans-serif !important;

              text-align: center !important;
            }


            .etiqueta-impresion:last-child {
              page-break-after: auto !important;
              break-after: auto !important;
            }


            /* ======================================
               CONTENIDO ROTADO 90 GRADOS
            ====================================== */

            .contenido-etiqueta {
  position: absolute !important;

  width: 47mm !important;
  height: 24mm !important;

  left: 1.5mm !important;
  top: 1mm !important;

  transform: none !important;
  transform-origin: center center !important;

  display: flex !important;
  flex-direction: column !important;

  justify-content: flex-start !important;
  align-items: center !important;

  box-sizing: border-box !important;

  padding: 0 !important;

  overflow: visible !important;
}


/* MARCA */
.marca {
  width: 100% !important;
              flex-shrink: 0 !important;

  font-size: 8px !important;
  font-weight: 900 !important;

  line-height: 8px !important;
  height: 8px !important;

  margin: 0 !important;
  padding: 0 !important;

  white-space: nowrap !important;
}


/* NOMBRE */
.producto {
  width: 100% !important;
              flex-shrink: 0 !important;

  font-size: 8px !important;
  font-weight: 700 !important;

  line-height: 8px !important;
  height: 8px !important;

  margin: 0.5mm 0 0 0 !important;
  padding: 0 !important;

  white-space: nowrap !important;

  overflow: hidden !important;
}


/* TALLE / COLOR */
.detalle {
  width: 100% !important;
              flex-shrink: 0 !important;

  font-size: 7px !important;
  font-weight: 600 !important;

  line-height: 7px !important;
  height: 7px !important;

  margin: 0.3mm 0 0 0 !important;
  padding: 0 !important;

  white-space: nowrap !important;

  overflow: hidden !important;
}


/* PRECIO */
.precio {
  width: 100% !important;

  font-size: 10px !important;
  font-weight: 900 !important;

  line-height: 10px !important;
  height: 10px !important;

  margin: 0.3mm 0 0 0 !important;
  padding: 0 !important;

  white-space: nowrap !important;
}


/* CÓDIGO DE BARRAS */
.codigo-barras {
  display: block !important;
  transform: none !important;

  /*
     IMPORTANTE:
     como todo .contenido-etiqueta está rotado,
     invertimos las dimensiones del SVG.
  */

  width: 5mm !important;
  height: 43mm !important;

  min-width: 5mm !important;
  max-width: 5mm !important;

  margin: 0.5mm auto 0 !important;

  padding: 0 !important;

  flex-shrink: 0 !important;
}


/* NÚMERO DEL CÓDIGO */
.numero-codigo {
  width: 100% !important;

  font-size: 6px !important;
  font-weight: 700 !important;

  line-height: 6px !important;
  height: 6px !important;

  margin: 0 !important;
  padding: 0 !important;

  white-space: nowrap !important;
}
  

         


            /* ======================================
               TEXTOS - POSICIONES FIJAS
            ====================================== */

            .marca {
              display: block !important;
              visibility: visible !important;
              position: absolute !important;

              left: 1.5mm !important;
              top: 1mm !important;

              width: 47mm !important;
              height: 4mm !important;

              font-size: 9px !important;
              font-weight: 900 !important;
              line-height: 4mm !important;

              margin: 0 !important;
              padding: 0 !important;

              overflow: hidden !important;
              white-space: nowrap !important;
              text-align: center !important;
            }


            .producto {
              display: block !important;
              visibility: visible !important;
              position: absolute !important;

              left: 1.5mm !important;
              top: 5.5mm !important;

              width: 47mm !important;
              height: 3mm !important;

              font-size: 10px !important;
              font-weight: 700 !important;
              line-height: 3mm !important;

              margin: 0 !important;
              padding: 0 !important;

              white-space: nowrap !important;
              overflow: hidden !important;
              text-overflow: ellipsis !important;
              text-align: center !important;
            }


            .detalle {
              display: block !important;
              visibility: visible !important;
              position: absolute !important;

              left: 1.5mm !important;
              top: 10mm !important;

              width: 47mm !important;
              height: 3mm !important;

              font-size: 9px !important;
              font-weight: 600 !important;
              line-height: 3mm !important;

              margin: 0 !important;
              padding: 0 !important;

              white-space: nowrap !important;
              overflow: hidden !important;
              text-align: center !important;
            }


            .precio {
              display: block !important;
              visibility: visible !important;
              position: absolute !important;

              left: 1.5mm !important;
              top: 15mm !important;

              width: 47mm !important;
              height: 4mm !important;

              font-size: 14px !important;
              font-weight: 900 !important;
              line-height: 4mm !important;

              margin: 0 !important;
              padding: 0 !important;

              white-space: nowrap !important;
              text-align: center !important;
            }


            /* ======================================
               CÓDIGO DE BARRAS
            ====================================== */

            .codigo-barras {
              display: block !important;
              transform: none !important;

              width: 38mm !important;

              height: 7mm !important;

              min-width: 38mm !important;
              max-width: 38mm !important;

              min-height: 7mm !important;
              max-height: 7mm !important;

              position: absolute !important;
              left: 6mm !important;
              top: 19mm !important;

              margin: 0 !important;

              padding: 0 !important;
            }


            /* ======================================
               NÚMERO DEL CÓDIGO
            ====================================== */

            .numero-codigo {
              width: 100% !important;

              font-size: 6px !important;

              font-weight: 700 !important;

              line-height: 6px !important;

              height: 6px !important;

              margin: 0 !important;
              padding: 0 !important;

              white-space: nowrap !important;
            }


            /* ======================================
               OCULTAR INTERFAZ
            ====================================== */

            .no-imprimir {
              display: none !important;

              visibility: hidden !important;
            }
          }
        `}
      </style>


      {/* ==========================================
          INTERFAZ - NO SE IMPRIME
      ========================================== */}

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


      {/* ==========================================
          ETIQUETAS
      ========================================== */}

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
