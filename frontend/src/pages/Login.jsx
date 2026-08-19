import { useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import Layout from "../components/Layout"
import Input from "../components/Input"
import {EMAIL_REGEX } from "../utils/emailValidation"
import { authApi } from "../services/api"

const RUTAS_POR_ROL = {
  estudiante:    "/dashboardAlumno",
  encargado:     "/dashboardEncargado",
  administrador: "/dashboardAdmin",
}

function Login() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setError("")
    if (!email.trim()) return setError("El correo es obligatorio")
    if (!password.trim()) return setError("La contraseña es obligatoria")
    if (!EMAIL_REGEX.test(email.trim()))
      return setError("Solo se permiten correos institucionales @utpn.edu.mx")

    setLoading(true)
    try {
      const res = await authApi.login(email.trim(), password)
      localStorage.setItem("token", res.access_token)
      localStorage.setItem("user", JSON.stringify({
        full_name: res.full_name, student_id: res.student_id, role: res.role,
      }))
      navigate(RUTAS_POR_ROL[res.role] || "/")
    } catch (e) {
      setError("Correo o contraseña incorrectos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>

        {/* Mensaje de éxito al regresar del flujo de recuperación */}
        {state?.message && (
          <p className="text-green-600 text-sm text-center bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            {state.message}
          </p>
        )}

        <Input label="Correo institucional:" type="email" placeholder="ejemplo@utpn.edu.mx"
          value={email} onChange={(e) => setEmail(e.target.value)} />

        <Input label="Contraseña:" type="password" placeholder="Ingrese su contraseña"
          value={password} onChange={(e) => setPassword(e.target.value)} />

        {error && <p className="text-red-500 text-sm -mt-2 mb-4">{error}</p>}

        <p className="text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg p-3 mb-4">
          ¿Olvidaste tu contraseña?{" "}
          <Link to="/recuperarContrasena" className="text-[#00B58E] font-semibold underline">
            Recupérala aquí
          </Link>
        </p>

        <div className="flex justify-center mt-2">
          <button onClick={handleLogin} disabled={loading}
            className="bg-[#06B800] font-bold text-white px-6 py-2 rounded-full hover:bg-green-800 hover:scale-105 transition duration-200">
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </div>

        <p className="text-center mt-4">¿Aún no tienes cuenta?</p>
        <Link to="/registrarCorreo" className="text-[#00B58E] font-semibold block text-center w-full hover:underline">
          Regístrate
        </Link>
      </div>
    </Layout>
  )
}

export default Login
