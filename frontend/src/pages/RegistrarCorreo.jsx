import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Input from "../components/Input"
import Layout from "../components/Layout"
import { ADMIN_EMAIL, ESTUDIANTE_REGEX, ENCARGADO_REGEX, EMAIL_REGEX } from "../utils/emailValidation"
import { authApi } from "../services/api"

const RUTAS_REGISTRO_POR_ROL = {
  estudiante:    "/registroAlumno",
  encargado:     "/registroEncargado",
  administrador: "/registroAdmin",
}

function detectarRol(email) {
  const correo = email.trim().toLowerCase()
  if (correo === ADMIN_EMAIL)          return "administrador"
  if (ESTUDIANTE_REGEX.test(correo))   return "estudiante"
  if (ENCARGADO_REGEX.test(correo))    return "encargado"
  return null
}

function RegistrarCorreo() {
  const [email, setEmail]     = useState("")
  const [error, setError]     = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleContinue() {
    setError("")
    if (!email.trim())                return setError("El correo es obligatorio")
    if (!EMAIL_REGEX.test(email.trim())) return setError("Solo se permiten correos institucionales @utpn.edu.mx")

    const rol = detectarRol(email)
    if (!rol) return setError("No fue posible determinar el tipo de rol del correo ingresado")

    setLoading(true)
    try {
      const res = await authApi.validateEmail(email.trim())
      if (res.already_registered) {
        setError("Este correo ya tiene una cuenta registrada. Inicia sesión.")
      } else {
        navigate(RUTAS_REGISTRO_POR_ROL[rol], { state: { email: email.trim() } })
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Registrarse</h2>

        <Input label="Correo institucional:" type="email" placeholder="ejemplo@utpn.edu.mx"
          value={email} onChange={(e) => { setEmail(e.target.value); setError("") }} />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="flex justify-center">
          <button onClick={handleContinue} disabled={loading}
            className="bg-[#06B800] font-bold text-white px-6 py-2 rounded-full hover:bg-green-800 hover:scale-105 transition">
            {loading ? "Verificando..." : "Continuar"}
          </button>
        </div>
      </div>
    </Layout>
  )
}

export default RegistrarCorreo
