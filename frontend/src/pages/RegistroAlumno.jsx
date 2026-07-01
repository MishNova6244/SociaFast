import { useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import Input from "../components/Input"
import Layout from "../components/Layout"
import { authApi } from "../services/api"

function Registro() {
  const { state } = useLocation()       // recibe el correo validado desde ValidacionCorreo
  const navigate  = useNavigate()

  const [form, setForm] = useState({
    nombre: "", apellido_paterno: "", apellido_materno: "",
    matricula: "", carrera: "",
    password: "", confirm_password: "",
  })
  const [error, setError]     = useState("")
  const [loading, setLoading] = useState(false)

  // Un solo handler para todos los Input de texto
  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  async function handleRegistro() {
    setError("")
    setLoading(true)
    try {
      await authApi.register({ ...form, correo: state?.correo })
      navigate("/")   // redirige al login tras registro exitoso
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout className="py-8">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Crear Cuenta</h2>

        <Input label="Nombre(s):"         type="text"     placeholder="Ingrese su nombre"           value={form.nombre}           onChange={handleChange("nombre")} />
        <Input label="Apellido paterno:"  type="text"     placeholder="Ingrese su apellido paterno" value={form.apellido_paterno}  onChange={handleChange("apellido_paterno")} />
        <Input label="Apellido materno:"  type="text"     placeholder="Ingrese su apellido materno" value={form.apellido_materno}  onChange={handleChange("apellido_materno")} />
        <Input label="Matrícula:"         type="text"     placeholder="Ejemplo: 25310206"           value={form.matricula}         onChange={handleChange("matricula")} />

        <label className="block mb-2 font-medium">Carrera:</label>
        <select
          value={form.carrera}
          onChange={handleChange("carrera")}
          className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#18AD8F] transition duration-200"
        >
          <option value="" disabled>Seleccione una carrera</option>
          <option value="mecatronica">Ing. en Mecatrónica</option>
          <option value="industrial">Ing. Industrial</option>
          <option value="logistica">Ing. en Logística Internacional</option>
          <option value="tecnologias">Ing. en Tecnologías de la Información e Innovación Digital</option>
          <option value="arquitectura">Lic. en Arquitectura</option>
          <option value="administracion">Lic. en Administración</option>
          <option value="contaduria">Lic. en Contaduría</option>
          <option value="mixta">Modalidad Mixta</option>
          <option value="semiconductores">Semiconductores</option>
        </select>

        <Input label="Contraseña:"         type="password" placeholder="Ingrese una contraseña"   value={form.password}          onChange={handleChange("password")} />
        <Input label="Confirmar contraseña:" type="password" placeholder="Confirme su contraseña" value={form.confirm_password}   onChange={handleChange("confirm_password")} />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="flex justify-center">
          <button
            onClick={handleRegistro}
            disabled={loading}
            className="bg-green-500 font-bold text-white px-6 py-2 rounded-full hover:bg-green-800 hover:scale-105 transition duration-200"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </div>

        <p className="text-center mt-4">¿Ya tienes una cuenta?</p>
        <Link to="/" className="text-[#00B58E] font-semibold block text-center w-full hover:underline">
          Iniciar sesión
        </Link>
      </div>
    </Layout>
  )
}

export default Registro