import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Layout from "../components/Layout"
import Input from "../components/Input"
import { authApi } from "../services/api"

const MAX_INTENTOS = 3

function Login() {
  const [correo, setCorreo]       = useState("")
  const [password, setPassword]   = useState("")
  const [error, setError]         = useState("")
  const [loading, setLoading]     = useState(false)
  const [intentos, setIntentos]   = useState(0)
  const navigate = useNavigate()

  async function handleLogin() {
    setError("")

    if (!correo.trim()) {
      setError("El correo es obligatorio")
      return
    }

    if (!password.trim()) {
      setError("La contraseña es obligatoria")
      return
    }

    if (!correo.endsWith("@utpn.edu.mx")) {
      setError("Acceso no autorizado. Solo se permiten correos institucionales @utpn.edu.mx")
      return
    }
    
    setLoading(true)
    try {
      const res = await authApi.login(correo, password)

      localStorage.setItem("token", res.access_token)
      localStorage.setItem("user", JSON.stringify({
        nombre:    res.nombre,
        matricula: res.matricula,
        rol:       res.rol,
      }))

      navigate("/dashboardAlumno")
   } catch (e) {
  const nuevosIntentos = intentos + 1
  setIntentos(nuevosIntentos)

  if (nuevosIntentos >= MAX_INTENTOS) {
    setError(`Contraseña incorrecta. Has alcanzado ${MAX_INTENTOS} intentos fallidos.`)
  } else {
    setError(`Contraseña incorrecta. Intento ${nuevosIntentos} de ${MAX_INTENTOS}.`)
  }
} finally {
  setLoading(false)
}
  }

  return (
    <Layout>
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>

        <Input
          label="Correo institucional:"
          type="email"
          placeholder="ejemplo@utpn.edu.mx"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />

        <Input
          label="Contraseña:"
          type="password"
          placeholder="Ingrese su contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {/* Mostrar aviso de recuperación después de MAX_INTENTOS fallos */}
        {intentos >= MAX_INTENTOS && (
          <p className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-300 rounded-lg p-3 mb-3">
            ¿Olvidaste tu contraseña?{" "}
            <Link to="/recuperar" className="font-semibold underline hover:text-yellow-900">
              Recupérala aquí
            </Link>
          </p>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-[#06B800] font-bold text-white px-6 py-2 rounded-full hover:bg-green-800 hover:scale-105 transition"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </div>

        <p className="text-center mt-4">¿Aún no tienes cuenta?</p>
        <Link to="/validarCorreo" className="text-[#00B58E] font-semibold block text-center w-full hover:underline">
          Registrarse
        </Link>
      </div>
    </Layout>
  )
}

export default Login