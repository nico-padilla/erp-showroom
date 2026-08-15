import { useState } from "react"

function ProductoForm({ agregarProducto }) {
  const [producto, setProducto] = useState({
    codigo: "",
    codigo_barras: "",
    nombre: "",
    descripcion: "",
    categoria: "",
    marca: "",
    talle: "",
    color: "",
    precio_compra: "",
    precio_venta: "",
    stock: "",
    stock_minimo: "1",
    imagen: "",
    activo: true
  })

  function manejarCambio(e) {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value

    setProducto({
      ...producto,
      [e.target.name]: value
    })
  }

  function guardar(e) {
    e?.preventDefault()

    agregarProducto({
      codigo: producto.codigo,
      codigo_barras: producto.codigo_barras || null,
      nombre: producto.nombre,
      descripcion: producto.descripcion || null,
      categoria: producto.categoria,
      marca: producto.marca || null,
      talle: producto.talle,
      color: producto.color,
      precio_compra: Number(producto.precio_compra),
      precio_venta: Number(producto.precio_venta),
      stock: Number(producto.stock),
      stock_minimo: Number(producto.stock_minimo),
      imagen: producto.imagen || null,
      activo: producto.activo
    })

    setProducto({
      codigo: "",
      codigo_barras: "",
      nombre: "",
      descripcion: "",
      categoria: "",
      marca: "",
      talle: "",
      color: "",
      precio_compra: "",
      precio_venta: "",
      stock: "",
      stock_minimo: "1",
      imagen: "",
      activo: true
    })
  }

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ddd",
        marginBottom: "20px"
      }}
    >
      <h2>Nuevo Producto</h2>

      <form onSubmit={guardar} style={{ display: "grid", gap: "10px", maxWidth: "700px" }}>
        <input
          name="codigo"
          placeholder="Código"
          value={producto.codigo}
          onChange={manejarCambio}
          required
        />

        <input
          name="codigo_barras"
          placeholder="Código de barras"
          value={producto.codigo_barras}
          onChange={manejarCambio}
        />

        <input
          name="nombre"
          placeholder="Nombre"
          value={producto.nombre}
          onChange={manejarCambio}
          required
        />

        <input
          name="descripcion"
          placeholder="Descripción"
          value={producto.descripcion}
          onChange={manejarCambio}
        />

        <input
          name="categoria"
          placeholder="Categoría"
          value={producto.categoria}
          onChange={manejarCambio}
          required
        />

        <input
          name="marca"
          placeholder="Marca"
          value={producto.marca}
          onChange={manejarCambio}
        />

        <input
          name="talle"
          placeholder="Talle"
          value={producto.talle}
          onChange={manejarCambio}
          required
        />

        <input
          name="color"
          placeholder="Color"
          value={producto.color}
          onChange={manejarCambio}
          required
        />

        <input
          type="number"
          name="precio_compra"
          placeholder="Precio compra"
          value={producto.precio_compra}
          onChange={manejarCambio}
          required
        />

        <input
          type="number"
          name="precio_venta"
          placeholder="Precio venta"
          value={producto.precio_venta}
          onChange={manejarCambio}
          required
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={producto.stock}
          onChange={manejarCambio}
          required
        />

        <input
          type="number"
          name="stock_minimo"
          placeholder="Stock mínimo"
          value={producto.stock_minimo}
          onChange={manejarCambio}
          required
        />

        <input
          name="imagen"
          placeholder="URL de imagen"
          value={producto.imagen}
          onChange={manejarCambio}
        />

        <label>
          <input
            type="checkbox"
            name="activo"
            checked={producto.activo}
            onChange={manejarCambio}
          /> Activo
        </label>

        <button type="submit">Guardar producto</button>
      </form>
    </div>
  )
}

export default ProductoForm
