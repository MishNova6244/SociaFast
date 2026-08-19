import { useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import Layout from "../components/Layout"
import Input from "../components/Input"
import { authApi } from "../services/api"

function RegistroAlumno() {
  const { state } = useLocation()
  const navigate  = useNavigate()

  const [form, setForm] = useState({
    first_name: "", paternal_surname: "", maternal_surname: "",
    student_id: "", career: "", cuatrimestre: "", password: "", confirm_password: "",
  })
  const [errors, setErrors]             = useState({})
  const [generalError, setGeneralError] = useState("")
  const [loading, setLoading]           = useState(false)

  const set = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
    if (errors[field]) setErrors({ ...errors, [field]: "" })
  }

  function validate() {
    const e = {}
    if (!form.first_name.trim())       e.first_name       = "El nombre es obligatorio"
    if (!form.paternal_surname.trim()) e.paternal_surname = "El apellido paterno es obligatorio"
    if (!form.maternal_surname.trim()) e.maternal_surname = "El apellido materno es obligatorio"
    if (!form.student_id)              e.student_id       = "La matrícula es obligatoria"
    else if (!/^\d{8}$/.test(form.student_id))
      e.student_id = "Debe tener exactamente 8 dígitos"
    else if (state?.email && form.student_id !== state.email.split("@")[0])
      e.student_id = "La matrícula debe coincidir con el correo ingresado"
    if (!form.career)                  e.career           = "Selecciona una carrera"
    if (!form.cuatrimestre)            e.cuatrimestre     = "Selecciona un cuatrimestre"
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
      await authApi.register({ ...form, email: state?.email })
      navigate("/")
    } catch (err) {
      setGeneralError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout className="py-8">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Crear Cuenta</h2>

        <Input label="Nombre(s):" placeholder="Ingrese su nombre"
          value={form.first_name} onChange={set("first_name")} error={errors.first_name} />
        <Input label="Apellido paterno:" placeholder="Ingrese su apellido paterno"
          value={form.paternal_surname} onChange={set("paternal_surname")} error={errors.paternal_surname} />
        <Input label="Apellido materno:" placeholder="Ingrese su apellido materno"
          value={form.maternal_surname} onChange={set("maternal_surname")} error={errors.maternal_surname} />
        <Input label="Matrícula:" placeholder="Ejemplo: 25310206"
          value={form.student_id} onChange={set("student_id")} error={errors.student_id} />

        {/* Carrera */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Carrera:</label>
          <select value={form.career} onChange={set("career")}
            className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 transition duration-200
              ${errors.career ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-[#18AD8F]"}`}>
            <option value="" disabled>Seleccione una carrera</option>
            <option value="industrial">Ing. Industrial</option>
            <option value="mecatronica">Ing. en Mecatrónica</option>
            <option value="logistica">Ing. en Logística Internacional</option>
            <option value="tecnologias">Ing. en Tecnologías de la Información e Innovación Digital</option>
            <option value="arquitectura">Lic. en Arquitectura</option>
            <option value="administracion">Lic. en Administración</option>
            <option value="contaduria">Lic. en Contaduría</option>
            <option value="mixta">Modalidad Mixta</option>
            <option value="semiconductores">Semiconductores</option>
          </select>
          {errors.career && <p className="text-red-500 text-xs mt-1">{errors.career}</p>}
        </div>

        {/* Cuatrimestre */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Cuatrimestre:</label>
          <select value={form.cuatrimestre} onChange={set("cuatrimestre")}
            className={`w-full border rounded-lg p-3 focus:outline-none focus:ring-2 transition duration-200
              ${errors.cuatrimestre ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-[#18AD8F]"}`}>
            <option value="" disabled>Seleccione un cuatrimestre</option>
            <option value="1">1° Cuatrimestre</option>
            <option value="2">2° Cuatrimestre</option>
            <option value="3">3° Cuatrimestre</option>
            <option value="4">4° Cuatrimestre</option>
            <option value="5">5° Cuatrimestre</option>
          </select>
          {errors.cuatrimestre && <p className="text-red-500 text-xs mt-1">{errors.cuatrimestre}</p>}
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

export default RegistroAlumno
