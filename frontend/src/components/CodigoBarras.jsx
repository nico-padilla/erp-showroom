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
        width: 1.1,
        height: 24,
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

          @page {
            size: 50mm 25mm;
            margin: 0;
          }


          .zona-etiquetas {
            display: none;
          }


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

            body * {
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

            .zona-etiquetas * {
              visibility: visible !important;
            }


            /* ======================================
               ETIQUETA 50 x 25 mm
            ====================================== */

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
               CONTENIDO
               ESTA ROTACIÓN YA FUNCIONA
            ====================================== */

            .contenido-etiqueta {

              position: absolute !important;

              width: 25mm !important;
              height: 50mm !important;

              left: 12.5mm !important;
              top: -12.5mm !important;

              transform: rotate(90deg) !important;

              transform-origin: center center !important;

              box-sizing: border-box !important;

              display: flex !important;

              flex-direction: column !important;

              justify-content: flex-start !important;

              align-items: center !important;

              padding: 1mm !important;

              overflow: hidden !important;
            }


            /* ======================================
               MARCA
            ====================================== */

            .marca {

              width: 100% !important;

              font-size: 7px !important;

              font-weight: 900 !important;

              line-height: 7px !important;

              height: 7px !important;

              margin: 0 !important;
              padding: 0 !important;

              white-space: nowrap !important;

              overflow: hidden !important;
            }


            /* ======================================
               PRODUCTO
            ====================================== */

            .producto {

              width: 100% !important;

              font-size: 7px !important;

              font-weight: 700 !important;

              line-height: 7px !important;

              height: 7px !important;

              margin: 0.3mm 0 0 0 !important;

              padding: 0 !important;

              white-space: nowrap !important;

              overflow: hidden !important;

              text-overflow: ellipsis !important;
            }


            /* ======================================
               TALLE / COLOR
            ====================================== */

            .detalle {

              width: 100% !important;

              font-size: 6px !important;

              font-weight: 600 !important;

              line-height: 6px !important;

              height: 6px !important;

              margin: 0.2mm 0 0 0 !important;

              padding: 0 !important;

              white-space: nowrap !important;

              overflow: hidden !important;
            }


            /* ======================================
               PRECIO
            ====================================== */

            .precio {

              width: 100% !important;

              font-size: 9px !important;

              font-weight: 900 !important;

              line-height: 9px !important;

              height: 9px !important;

              margin: 0.3mm 0 0 0 !important;

              padding: 0 !important;

              white-space: nowrap !important;
            }


            /* ======================================
               CÓDIGO DE BARRAS

               IMPORTANTE:
               EL CONTENIDO ESTÁ ROTADO 90°.

               ANTES DE ROTAR:
               5mm ALTO x 43mm ANCHO

               DESPUÉS DE ROTAR:
               43mm ANCHO x 5mm ALTO
            ====================================== */

            .codigo-barras {

              display: block !important;

              width: 5mm !important;

              height: 43mm !important;

              min-width: 5mm !important;

              max-width: 5mm !important;

              min-height: 43mm !important;

              max-height: 43mm !important;

              margin: 0.5mm auto 0 !important;

              padding: 0 !important;

              flex-shrink: 0 !important;
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

          }
        `}
      </style>


      <div className="zona-etiquetas">

        {etiquetas.map((_, i) => (
          <Etiqueta
            key={i}
            producto={producto}
          />
        ))}

      </div>


      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center"
        }}
      >

        <button onClick={imprimir}>
          Imprimir etiquetas
        </button>

        <button onClick={onCerrar}>
          Cerrar
        </button>

        <select
          value={modo}
          onChange={(e) => setModo(e.target.value)}
        >

          <option value="stock">
            Stock ({stock})
          </option>

          <option value="manual">
            Cantidad manual
          </option>

        </select>

        {modo === "manual" && (
          <input
            type="number"
            min="1"
            value={cantidadManual}
            onChange={(e) =>
              setCantidadManual(e.target.value)
            }
            style={{
              width: "70px"
            }}
          />
        )}

      </div>

    </>
  )
}
