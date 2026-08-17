import { useEffect, useRef } from "react"
import JsBarcode from "jsbarcode"

export default function CodigoBarras({ producto, onCerrar }) {
  const svgRef = useRef(null)
  const codigo = producto?.codigo_barras || producto?.codigo || ""

  useEffect(() => {
    if (!svgRef.current || !codigo) return

    try {
      JsBarcode(svgRef.current, String(codigo), {
        format: "CODE128",
        width: 2,
        height: 60,
        displayValue: true,
        fontSize: 14,
        margin: 10,
      })
    } catch (error) {
      console.error("Error generando código de barras:", error)
    }
  }, [codigo])

  if (!codigo) {
    return <span>Sin código</span>
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Etiqueta de código de barras</h2>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="bg-blue-600 text-white px-3 py-2 rounded"
            >
              Imprimir
            </button>
            <button
              onClick={onCerrar}
              className="bg-gray-300 px-3 py-2 rounded"
            >
              Cerrar
            </button>
          </div>
        </div>

        <div className="text-center border rounded p-4 bg-white">
          <div className="font-bold text-lg mb-2">{producto?.nombre || "Producto"}</div>
          <svg ref={svgRef} style={{ maxWidth: "100%" }} />
          <div className="mt-2 text-sm text-gray-600">{codigo}</div>
        </div>
      </div>
    </div>
  )
}
