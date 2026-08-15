import { useEffect, useRef } from "react"
import JsBarcode from "jsbarcode"

export default function CodigoBarras({ codigo }) {
  const svgRef = useRef(null)

  useEffect(() => {
    if (!svgRef.current || !codigo) return

    try {
      JsBarcode(svgRef.current, String(codigo), {
        format: "CODE128",
        width: 2,
        height: 60,
        displayValue: true,
        fontSize: 14,
        margin: 10
      })
    } catch (error) {
      console.error(
        "Error generando código de barras:",
        error
      )
    }
  }, [codigo])

  if (!codigo) {
    return <span>Sin código</span>
  }

  return (
    <svg
      ref={svgRef}
      style={{
        maxWidth: "100%"
      }}
    />
  )
}
