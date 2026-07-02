import { useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import Layout from "../components/Layout"
import { authApi } from "../services/api"

function Campo({ label, type = "text", placeholder, value, onChange, error }) {
  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 transition duration-200
          ${error ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-[#18AD8F]"}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

function RegistroAlumno() {
  const { state } = useLocation()
  const navigate  = useNavigate()

  const [form, setForm] = useState({
    nombre: "", apellido_paterno: "", apellido_materno: "",
    matricula: "", carrera: "", password: "", confirm_password: "",
  })
  const [errores, setErrores]           = useState({})
  const [errorGeneral, setErrorGeneral] = useState("")
  const [loading, setLoading]           = useState(false)

  const set = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
    if (errores[field]) setErrores({ ...errores, [field]: "" })
  }

  function validar() {
    const e = {}
    if (!form.nombre.trim())           e.nombre           = "El nombre es obligatorio"
    if (!form.apellido_paterno.trim()) e.apellido_paterno  = "El apellido paterno es obligatorio"
    if (!form.apellido_materno.trim()) e.apellido_materno  = "El apellido materno es obligatorio"
    if (!form.matricula)               e.matricula         = "La matricula es obligatoria"
    else if (!/^\d{8}$/.test(form.matricula)) e.matricula  = "Debe tener exactamente 8 digitos"
    if (!form.carrera)                 e.carrera           = "Selecciona una carrera"
    if (!form.password)                e.password          = "La contrasena es obligatoria"
    else if (form.password.length < 8) e.password          = "Minimo 8 caracteres"
    else if (!/[A-Z]/.test(form.password)) e.password      = "Debe incluir al menos una mayuscula"
    else if (!/\d/.test(form.password))    e.password      = "Debe incluir al menos un numero"
    if (form.password !== form.confirm_password) e.confirm_password = "Las contrasenas no coinciden"
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
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Crear Cuenta</h2>

        <Campo label="Nombre(s):"          placeholder="Ingrese su nombre"           value={form.nombre}          onChange={set("nombre")}          error={errores.nombre} />
        <Campo label="Apellido paterno:"   placeholder="Ingrese su apellido paterno" value={form.apellido_paterno} onChange={set("apellido_paterno")} error={errores.apellido_paterno} />
        <Campo label="Apellido materno:"   placeholder="Ingrese su apellido materno" value={form.apellido_materno} onChange={set("apellido_materno")} error={errores.apellido_materno} />
        <Campo label="Matricula:"          placeholder="Ejemplo: 25310206"           value={form.matricula}        onChange={set("matricula")}        error={errores.matricula} />

        <div className="mb-4">
          <label className="block mb-1 font-medium">Carrera:</label>
          <select
            value={form.carrera}
            onChange={set("carrera")}
            className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 transition duration-200
              ${errores.carrera ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-[#18AD8F]"}`}
          >
            <option value="" disabled>Seleccione una carrera</option>
            <option value="mecatronica">Ing. en Mecatronica</option>
            <option value="industrial">Ing. Industrial</option>
            <option value="logistica">Ing. en Logistica Internacional</option>
            <option value="tecnologias">Ing. en Tecnologias de la Informacion e Innovacion Digital</option>
            <option value="arquitectura">Lic. en Arquitectura</option>
            <option value="administracion">Lic. en Administracion</option>
            <option value="contaduria">Lic. en Contaduria</option>
            <option value="mixta">Modalidad Mixta</option>
            <option value="semiconductores">Semiconductores</option>
          </select>
          {errores.carrera && <p className="text-red-500 text-xs mt-1">{errores.carrera}</p>}
        </div>

        <Campo label="Contrasena:"          type="password" placeholder="Minimo 8 caracteres, 1 mayuscula y 1 numero" value={form.password}        onChange={set("password")}        error={errores.password} />
        <Campo label="Confirmar contrasena:" type="password" placeholder="Confirme su contrasena"                     value={form.confirm_password} onChange={set("confirm_password")} error={errores.confirm_password} />

        {errorGeneral && <p className="text-red-500 text-sm mb-4">{errorGeneral}</p>}

        <div className="w-full flex justify-center">
          <button
            onClick={handleRegistro}
            disabled={loading}
            className="bg-green-500 font-bold text-white px-6 py-2 rounded-full hover:bg-green-800 hover:scale-105 transition duration-200"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </div>

        <p className="text-center mt-4">Ya tienes una cuenta?</p>
        <Link to="/" className="text-[#00B58E] font-semibold block text-center w-full hover:underline">
          Iniciar sesion
        </Link>
      </div>
    </Layout>
  )
}

export default RegistroAlumno