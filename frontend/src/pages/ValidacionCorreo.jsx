import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Input from "../components/Input"
import Layout from "../components/Layout"
import { authApi } from "../services/api"

function ValidarCorreo() {
  const [correo, setCorreo] = useState("")
  const [error, setError]   = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleContinuar() {
    setError("")

    // Validación 1 — dominio institucional
    if (!correo.endsWith("@utpn.edu.mx")) {
      setError("Acceso no autorizado. Solo se permiten correos institucionales @utpn.edu.mx")
      return
    }

    // Validación 2 — distinguir estudiante vs encargado/admin antes de llamar al backend
    const usuario = correo.split("@")[0]
    if (!usuario || !/^\d+$/.test(usuario)) {
      setError("No autorizado. El registro de encargados y administradores es gestionado por el sistema.")
      return
    }

    setLoading(true)
    try {
      const res = await authApi.validarCorreo(correo)
      if (res.es_estudiante) {
        navigate("/registroAlumno", { state: { correo } })
      } else {
        setError(res.mensaje)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout className="">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Registrarse</h2>

        <Input
          label="Correo electrónico:"
          type="email"
          placeholder="ejemplo@utpn.edu.mx"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="flex justify-center">
          <button
            onClick={handleContinuar}
            disabled={loading}
            className="bg-[#06B800] font-bold text-white px-6 py-2 rounded-full hover:bg-green-800 hover:scale-105 transition"
          >
            {loading ? "Verificando..." : "Continuar"}
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default ValidarCorreo