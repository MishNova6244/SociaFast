import { useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import Layout from "../components/Layout"
import Input from "../components/Input"
import { authApi, actividadesApi } from "../services/api"

function RegistroEncargado() {
  const { state } = useLocation()
  const navigate  = useNavigate()

  const [actividades, setActividades] = useState([])
  const [form, setForm] = useState({
    first_name: "", paternal_surname: "", maternal_surname: "",
    assigned_activity: "", password: "", confirm_password: "",
  })
  const [errors, setErrors]             = useState({})
  const [generalError, setGeneralError] = useState("")
  const [loading, setLoading]           = useState(false)

  // Cargar actividades reales del backend
  useEffect(() => {
    actividadesApi.getAll()
      .then(setActividades)
      .catch(() => {}) // Si falla, el select queda vacío
  }, [])

  const set = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
    if (errors[field]) setErrors({ ...errors, [field]: "" })
  }

  function validate() {
    const e = {}
    if (!form.first_name.trim())       e.first_name       = "El nombre es obligatorio"
    if (!form.paternal_surname.trim()) e.paternal_surname = "El apellido paterno es obligatorio"
    if (!form.maternal_surname.trim()) e.maternal_surname = "El apellido materno es obligatorio"
    if (!form.assigned_activity)       e.assigned_activity = "Seleccione una actividad asignada"
    if (!form.password)                e.password         = "La contraseña es obligatoria"
    else if (form.password.length < 8) e.password         = "Mínimo 8 caracteres"
    else if (!/[A-Z]/.test(form.password)) e.password     = "Debe incluir al menos una mayúscula"
    else if (!/\d/.test(form.password))    e.password     = "Debe incluir al menos un número"
    if (form.password !== form.confirm_password) e.confirm_password = "Las contraseñas no coinciden"
    return e
  }

  async function handleRegister() {
    setGeneralError("")
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }

    setLoading(true)
    try {
      await authApi.registerSupervisor({ ...form, email: state?.email })
      navigate("/")
    } catch (err) {
      setGeneralError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Agrupar actividades por tipo para el select
  const deportes   = actividades.filter(a => a.tipo === "deporte")
  const culturales = actividades.filter(a => a.tipo === "cultural")
  const programas  = actividades.filter(a => a.tipo === "programa")

  return (
    <Layout className="py-8">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Crear Cuenta — Encargado</h2>

        <Input label="Nombre(s):" placeholder="Ingrese su nombre"
          value={form.first_name} onChange={set("first_name")} error={errors.first_name} />
        <Input label="Apellido paterno:" placeholder="Ingrese su apellido paterno"
          value={form.paternal_surname} onChange={set("paternal_surname")} error={errors.paternal_surname} />
        <Input label="Apellido materno:" placeholder="Ingrese su apellido materno"
          value={form.maternal_surname} onChange={set("maternal_surname")} error={errors.maternal_surname} />

        <div className="mb-4">
          <label className="block mb-1 font-medium">Actividad/programa asignado:</label>
          <select value={form.assigned_activity} onChange={set("assigned_activity")}
            className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 transition duration-200
              ${errors.assigned_activity ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-[#18AD8F]"}`}>
            <option value="" disabled>Seleccione una actividad/programa</option>
            {deportes.length > 0 && (
              <optgroup label="Deportes">
                {deportes.map(a => <option key={a.id} value={a.nombre}>{a.nombre}</option>)}
              </optgroup>
            )}
            {culturales.length > 0 && (
              <optgroup label="Cultural">
                {culturales.map(a => <option key={a.id} value={a.nombre}>{a.nombre}</option>)}
              </optgroup>
            )}
            {programas.length > 0 && (
              <optgroup label="Programas">
                {programas.map(a => <option key={a.id} value={a.nombre}>{a.nombre}</option>)}
              </optgroup>
            )}
          </select>
          {errors.assigned_activity && <p className="text-red-500 text-xs mt-1">{errors.assigned_activity}</p>}
        </div>

        <Input label="Contraseña:" type="password" placeholder="Mínimo 8 caracteres, 1 mayúscula y 1 número"
          value={form.password} onChange={set("password")} error={errors.password} />
        <Input label="Confirmar contraseña:" type="password" placeholder="Confirme su contraseña"
          value={form.confirm_password} onChange={set("confirm_password")} error={errors.confirm_password} />

        {generalError && <p className="text-red-500 text-sm mb-4">{generalError}</p>}

        <div className="w-full flex justify-center">
          <button onClick={handleRegister} disabled={loading}
            className="bg-green-500 font-bold text-white px-6 py-2 rounded-full hover:bg-green-800 hover:scale-105 transition duration-200">
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

export default RegistroEncargado
