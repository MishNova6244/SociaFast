import { useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import Layout from "../components/Layout"
import Input from "../components/Input"
import { authApi } from "../services/api"

function RegistroAdmin() {
  const { state } = useLocation()
  const navigate  = useNavigate()

  const [form, setForm] = useState({
    first_name: "", paternal_surname: "", maternal_surname: "",
    password: "", confirm_password: "",
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
      await authApi.registerAdmin({ ...form, email: state?.email })
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
        <h2 className="text-2xl font-bold text-center mb-6">Crear Cuenta — Administrador</h2>

        <Input label="Nombre(s):" placeholder="Ingrese su nombre"
          value={form.first_name} onChange={set("first_name")} error={errors.first_name} />
        <Input label="Apellido paterno:" placeholder="Ingrese su apellido paterno"
          value={form.paternal_surname} onChange={set("paternal_surname")} error={errors.paternal_surname} />
        <Input label="Apellido materno:" placeholder="Ingrese su apellido materno"
          value={form.maternal_surname} onChange={set("maternal_surname")} error={errors.maternal_surname} />
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

export default RegistroAdmin
