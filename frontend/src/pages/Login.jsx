import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Layout from "../components/Layout"
import Input from "../components/Input"
import { authApi } from "../services/api"

function Login() {
  const [correo, setCorreo]     = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()

  async function handleLogin() {
    setError("")
    setLoading(true)
    try {
      const res = await authApi.login(correo, password)

      // Guardar token y datos básicos para uso en el dashboard
      localStorage.setItem("token", res.access_token)
      localStorage.setItem("user", JSON.stringify({
        nombre:    res.nombre,
        matricula: res.matricula,
        rol:       res.rol,
      }))

      navigate("/dashboardAlumno")
    } catch (e) {
      setError(e.message)
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

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

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
