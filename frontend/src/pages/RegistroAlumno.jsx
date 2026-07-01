import { useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import Layout from "../components/Layout"
import { authApi } from "../services/api"

// Input con soporte de error por campo
function Field({ label, type = "text", placeholder, value, onChange, error }) {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 transition duration-200
          ${error ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-[#18AD8F]"}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

function Registro() {
  const { state }  = useLocation()
  const navigate   = useNavigate()

  const [form, setForm] = useState({
    nombre: "", apellido_paterno: "", apellido_materno: "",
    matricula: "", carrera: "",
    password: "", confirm_password: "",
  })
  const [errores, setErrores] = useState({})   // errores por campo
  const [errorGeneral, setErrorGeneral] = useState("")
  const [loading, setLoading] = useState(false)

  const set = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
    // Limpiar el error del campo al editarlo
    if (errores[field]) setErrores({ ...errores, [field]: "" })
  }

  // Validaciones en el cliente antes de llamar al backend
  function validar() {
    const e = {}
    if (!form.nombre.trim())           e.nombre           = "El nombre es obligatorio"
    if (!form.apellido_paterno.trim()) e.apellido_paterno = "El apellido paterno es obligatorio"
    if (!form.matricula)               e.matricula        = "La matrícula es obligatoria"
    else if (!/^\d{8}$/.test(form.matricula)) e.matricula = "Debe tener exactamente 8 dígitos"
    if (!form.carrera)                 e.carrera          = "Selecciona una carrera"
    if (!form.password)                e.password         = "La contraseña es obligatoria"
    else if (form.password.length < 8) e.password         = "Mínimo 8 caracteres"
    else if (!/[A-Z]/.test(form.password)) e.password     = "Debe incluir al menos una mayúscula"
    else if (!/\d/.test(form.password))    e.password     = "Debe incluir al menos un número"
    if (form.password !== form.confirm_password) e.confirm_password = "Las contraseñas no coinciden"
    return e
  }

  async function handleRegistro() {
    setErrorGeneral("")
    const e = validar()
    if (Object.keys(e).length > 0) { setErrores(e); return }

    setLoading(true)
    try {
      await authApi.register({ ...form, correo: state?.correo })
      navigate("/")
    } catch (err) {
      setErrorGeneral(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout className="py-8">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Crear Cuenta</h2>

        <Field label="Nombre(s):"          placeholder="Ingrese su nombre"           value={form.nombre}           onChange={set("nombre")}           error={errores.nombre} />
        <Field label="Apellido paterno:"   placeholder="Ingrese su apellido paterno" value={form.apellido_paterno}  onChange={set("apellido_paterno")}  error={errores.apellido_paterno} />
        <Field label="Apellido materno:"   placeholder="Ingrese su apellido materno" value={form.apellido_materno}  onChange={set("apellido_materno")} />
        <Field label="Matrícula:"          placeholder="Ejemplo: 25310206"           value={form.matricula}         onChange={set("matricula")}         error={errores.matricula} />

        <div className="mb-4">
          <label className="block mb-1 font-medium">Carrera:</label>
          <select
            value={form.carrera}
            onChange={set("carrera")}
            className={`w-full border rounded-lg p-2 focus:outline-none focus:ring-2 transition duration-200
              ${errores.carrera ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-[#18AD8F]"}`}
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
          {errores.carrera && <p className="text-red-500 text-xs mt-1">{errores.carrera}</p>}
        </div>

        <Field label="Contraseña:"          type="password" placeholder="Mínimo 8 caracteres, 1 mayúscula y 1 número" value={form.password}         onChange={set("password")}         error={errores.password} />
        <Field label="Confirmar contraseña:" type="password" placeholder="Confirme su contraseña"                     value={form.confirm_password}  onChange={set("confirm_password")} error={errores.confirm_password} />

        {errorGeneral && <p className="text-red-500 text-sm mb-4">{errorGeneral}</p>}

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