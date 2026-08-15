import { useEffect, useState } from "react"

const API = import.meta.env.VITE_API_URL

export default function Clientes() {
  const [clientes, setClientes] = useState([])

  const [busqueda, setBusqueda] = useState("")

  const [formulario, setFormulario] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    instagram: ""
  })

  const [editando, setEditando] = useState(null)

  const [error, setError] = useState("")
  const [mensaje, setMensaje] = useState("")

  useEffect(() => {
    cargarClientes()
  }, [])

  async function cargarClientes() {
    try {
      const respuesta = await fetch(`${API}/clientes/`)

      if (!respuesta.ok) {
        throw new Error(
          "No se pudieron cargar los clientes"
        )
      }

      const data = await respuesta.json()

      setClientes(
        Array.isArray(data) ? data : []
      )

    } catch (error) {
      console.error(error)
      setError(error.message)
    }
  }

  function cambiarCampo(e) {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    })
  }

  async function guardarCliente(e) {
    e.preventDefault()

    setError("")
    setMensaje("")

    try {
      const respuesta = await fetch(
        `${API}/clientes/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formulario)
        }
      )

      const data = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(
          data.detail ||
          "Error guardando cliente"
        )
      }

      setFormulario({
        nombre: "",
        apellido: "",
        telefono: "",
        email: "",
        instagram: ""
      })

      setMensaje(
        "Cliente agregado correctamente ✅"
      )

      cargarClientes()

    } catch (error) {
      console.error(error)
      setError(error.message)
    }
  }

  function comenzarEdicion(cliente) {
    setEditando({
      ...cliente
    })

    setError("")
    setMensaje("")
  }

  function cambiarCampoEdicion(
    campo,
    valor
  ) {
    setEditando({
      ...editando,
      [campo]: valor
    })
  }

  async function guardarEdicion() {
    if (!editando) return

    setError("")
    setMensaje("")

    try {
      const respuesta = await fetch(
        `${API}/clientes/${editando.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            nombre: editando.nombre,
            apellido: editando.apellido,
            telefono: editando.telefono,
            email: editando.email,
            instagram: editando.instagram
          })
        }
      )

      const data = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(
          data.detail ||
          "Error actualizando cliente"
        )
      }

      setEditando(null)

      setMensaje(
        "Cliente actualizado correctamente ✅"
      )

      cargarClientes()

    } catch (error) {
      console.error(error)
      setError(error.message)
    }
  }

  async function eliminarCliente(id) {
    const confirmar = window.confirm(
      "¿Seguro que querés eliminar este cliente?"
    )

    if (!confirmar) return

    setError("")
    setMensaje("")

    try {
      const respuesta = await fetch(
        `${API}/clientes/${id}`,
        {
          method: "DELETE"
        }
      )

      const data = await respuesta.json()

      if (!respuesta.ok) {
        throw new Error(
          data.detail ||
          "No se pudo eliminar el cliente"
        )
      }

      setMensaje(
        "Cliente eliminado correctamente ✅"
      )

      cargarClientes()

    } catch (error) {
      console.error(error)
      setError(error.message)
    }
  }

  const clientesFiltrados =
    clientes.filter(cliente => {
      const texto =
        String(busqueda || "")
          .toLowerCase()
          .trim()

      if (!texto) return true

      const nombre =
        String(cliente.nombre || "")
          .toLowerCase()

      const apellido =
        String(cliente.apellido || "")
          .toLowerCase()

      const telefono =
        String(cliente.telefono || "")
          .toLowerCase()

      const email =
        String(cliente.email || "")
          .toLowerCase()

      const instagram =
        String(cliente.instagram || "")
          .toLowerCase()

      return (
        nombre.includes(texto) ||
        apellido.includes(texto) ||
        telefono.includes(texto) ||
        email.includes(texto) ||
        instagram.includes(texto)
      )
    })

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "1400px",
        margin: "0 auto"
      }}
    >

      <h1>👥 Clientes</h1>

      {mensaje && (
        <div
          style={{
            background: "#d1fae5",
            color: "#065f46",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "15px",
            fontWeight: "bold"
          }}
        >
          {mensaje}
        </div>
      )}

      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "15px"
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "25px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)"
        }}
      >

        <h2>➕ Nuevo cliente</h2>

        <form
          onSubmit={guardarCliente}
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(2, 1fr)",
            gap: "12px",
            maxWidth: "800px"
          }}
        >

          <input
            name="nombre"
            placeholder="Nombre"
            value={formulario.nombre}
            onChange={cambiarCampo}
            required
            style={{
              padding: "12px"
            }}
          />

          <input
            name="apellido"
            placeholder="Apellido"
            value={formulario.apellido}
            onChange={cambiarCampo}
            required
            style={{
              padding: "12px"
            }}
          />

          <input
            name="telefono"
            placeholder="Teléfono / WhatsApp"
            value={formulario.telefono}
            onChange={cambiarCampo}
            required
            style={{
              padding: "12px"
            }}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formulario.email}
            onChange={cambiarCampo}
            style={{
              padding: "12px"
            }}
          />

          <input
            name="instagram"
            placeholder="@Instagram"
            value={formulario.instagram}
            onChange={cambiarCampo}
            style={{
              padding: "12px"
            }}
          />

          <button
            type="submit"
            style={{
              padding: "12px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            ➕ Guardar Cliente
          </button>

        </form>

      </div>

      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.08)"
        }}
      >

        <h2>🔎 Buscar clientes</h2>

        <input
          value={busqueda}
          onChange={e =>
            setBusqueda(e.target.value)
          }
          placeholder="Nombre, apellido, teléfono, email o Instagram"
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "16px",
            marginBottom: "20px",
            boxSizing: "border-box"
          }}
        />

        <h2>
          📋 Clientes encontrados:
          {" "}
          {clientesFiltrados.length}
        </h2>

        <div
          style={{
            overflowX: "auto"
          }}
        >

          <table
            border="1"
            cellPadding="10"
            style={{
              width: "100%",
              borderCollapse:
                "collapse"
            }}
          >

            <thead>

              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Instagram</th>
                <th>Acciones</th>
              </tr>

            </thead>

            <tbody>

              {clientesFiltrados.map(
                cliente => (

                  <tr
                    key={cliente.id}
                  >

                    <td>
                      {cliente.id}
                    </td>

                    <td>
                      {cliente.nombre}
                    </td>

                    <td>
                      {cliente.apellido}
                    </td>

                    <td>
                      {cliente.telefono}
                    </td>

                    <td>
                      {cliente.email || "-"}
                    </td>

                    <td>
                      {cliente.instagram || "-"}
                    </td>

                    <td>

                      <button
                        onClick={() =>
                          comenzarEdicion(
                            cliente
                          )
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
                          eliminarCliente(
                            cliente.id
                          )
                        }
                        style={{
                          cursor: "pointer"
                        }}
                      >
                        🗑️ Eliminar
                      </button>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

        {clientesFiltrados.length === 0 && (
          <p>
            No se encontraron clientes.
          </p>
        )}

      </div>

      {editando && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}
        >

          <div
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "12px",
              width: "500px",
              maxWidth: "90%"
            }}
          >

            <h2>
              ✏️ Editar cliente
            </h2>

            <input
              value={
                editando.nombre || ""
              }
              onChange={e =>
                cambiarCampoEdicion(
                  "nombre",
                  e.target.value
                )
              }
              placeholder="Nombre"
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "10px",
                boxSizing: "border-box"
              }}
            />

            <input
              value={
                editando.apellido || ""
              }
              onChange={e =>
                cambiarCampoEdicion(
                  "apellido",
                  e.target.value
                )
              }
              placeholder="Apellido"
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "10px",
                boxSizing: "border-box"
              }}
            />

            <input
              value={
                editando.telefono || ""
              }
              onChange={e =>
                cambiarCampoEdicion(
                  "telefono",
                  e.target.value
                )
              }
              placeholder="Teléfono"
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "10px",
                boxSizing: "border-box"
              }}
            />

            <input
              value={
                editando.email || ""
              }
              onChange={e =>
                cambiarCampoEdicion(
                  "email",
                  e.target.value
                )
              }
              placeholder="Email"
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "10px",
                boxSizing: "border-box"
              }}
            />

            <input
              value={
                editando.instagram || ""
              }
              onChange={e =>
                cambiarCampoEdicion(
                  "instagram",
                  e.target.value
                )
              }
              placeholder="Instagram"
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "20px",
                boxSizing: "border-box"
              }}
            />

            <button
              onClick={
                guardarEdicion
              }
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

      )}

    </div>
  )
}
