import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Layout from "../components/Layout"
import Input from "../components/Input"
import { authApi } from "../services/api"

function ActualizarContrasena() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    token: "", new_password: "", confirm_password: "",
  })
  const [errors, setErrors]             = useState({})
  const [generalError, setGeneralError] = useState("")
  const [loading, setLoading]           = useState(false)

  const set = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
    if (errors[field]) setErrors({ ...errors, [field]: "" })
    setGeneralError("")
  }

  function validate() {
    const e = {}
    if (!form.token.trim())
      e.token = "El código es obligatorio"
    else if (!/^\d{6}$/.test(form.token.trim()))
      e.token = "El código debe tener exactamente 6 dígitos"
    if (!form.new_password)
      e.new_password = "La nueva contraseña es obligatoria"
    else if (form.new_password.length < 8)
      e.new_password = "Mínimo 8 caracteres"
    else if (!/[A-Z]/.test(form.new_password))
      e.new_password = "Debe incluir al menos una mayúscula"
    else if (!/\d/.test(form.new_password))
      e.new_password = "Debe incluir al menos un número"
    if (form.new_password !== form.confirm_password)
      e.confirm_password = "Las contraseñas no coinciden"
    return e
  }

  async function handleReset() {
    setGeneralError("")
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }

    setLoading(true)
    try {
      await authApi.resetPassword(form)
      navigate("/", { state: { message: "Contraseña actualizada correctamente. Ya puedes iniciar sesión." } })
    } catch (err) {
      setGeneralError(err.message || "Código inválido o expirado. Solicita uno nuevo.")
    } finally {
      setLoading(false)
    }
  }

  // Demo — salta la validación del código
  function handleDemo() {
    navigate("/", { state: { message: "Contraseña actualizada correctamente. Ya puedes iniciar sesión." } })
  }

  return (
    <Layout>
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2">Nueva contraseña</h2>
        <p className="text-gray-500 text-sm text-center mb-6">
          Ingresa el código de 6 dígitos que recibiste en tu correo institucional.
        </p>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Código de verificación:</label>
          <input
            type="text"
            maxLength={6}
            placeholder="000000"
            value={form.token}
            onChange={set("token")}
            className={`w-full border rounded-lg p-3 text-center text-2xl font-bold tracking-widest
              focus:outline-none focus:ring-2 transition duration-200
              ${errors.token ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-[#18AD8F]"}`}
          />
          {errors.token && <p className="text-red-500 text-xs mt-1">{errors.token}</p>}
        </div>

        <Input label="Nueva contraseña:" type="password"
          placeholder="Mínimo 8 caracteres, 1 mayúscula y 1 número"
          value={form.new_password} onChange={set("new_password")} error={errors.new_password} />

        <Input label="Confirmar contraseña:" type="password"
          placeholder="Repite tu nueva contraseña"
          value={form.confirm_password} onChange={set("confirm_password")} error={errors.confirm_password} />

        {generalError && (
          <p className="text-red-500 text-sm mb-4 text-center">{generalError}</p>
        )}

        <div className="flex justify-center mt-2">
          <button onClick={handleReset} disabled={loading}
            className="bg-[#18AD8F] font-bold text-white px-6 py-2 rounded-full hover:bg-[#149B80] hover:scale-105 transition duration-200">
            {loading ? "Actualizando..." : "Actualizar contraseña"}
          </button>
        </div>

        {/* Botón demo — solo para presentación */}
        <div className="flex justify-center mt-3">
          <button onClick={handleDemo}
            className="text-xs text-gray-300 hover:text-gray-400 transition underline">
            Continuar demo →
          </button>
        </div>

        <div className="mt-4 text-center space-y-2">
          <p className="text-sm text-gray-500">
            ¿No recibiste el código?{" "}
            <Link to="/recuperarContrasena" className="text-[#18AD8F] font-semibold hover:underline">
              Solicitar nuevo código
            </Link>
          </p>
          <Link to="/" className="text-[#18AD8F] text-sm font-semibold hover:underline block">
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export default ActualizarContrasena