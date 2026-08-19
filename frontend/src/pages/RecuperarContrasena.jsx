import { useState } from "react"
import { Link } from "react-router-dom"
import Layout from "../components/Layout"
import Input from "../components/Input"
import { authApi } from "../services/api"

const DOMAIN = "@utpn.edu.mx"

function RecuperarContrasena() {
  const [email, setEmail]     = useState("")
  const [error, setError]     = useState("")
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)

  async function handleEnviar() {
    setError("")

    if (!email.trim())
      return setError("El correo es obligatorio")
    if (!email.endsWith(DOMAIN))
      return setError("Solo se permiten correos institucionales @utpn.edu.mx")

    setLoading(true)
    try {
      await authApi.forgotPassword(email.trim())
      // Siempre muestra éxito — el backend no revela si el correo existe
      setEnviado(true)
    } catch (e) {
  // Aunque falle el envío del correo, mostramos confirmación
  // El token ya se generó en la BD
  setEnviado(true)
}
  }

  return (
    <Layout>
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2">Recuperar contraseña</h2>
        <p className="text-gray-500 text-sm text-center mb-6">
          Ingresa tu correo institucional y te enviaremos un código de 6 dígitos.
        </p>

        {!enviado ? (
          <>
            <Input
              label="Correo institucional:"
              type="email"
              placeholder="ejemplo@utpn.edu.mx"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError("") }}
            />

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <div className="flex justify-center mt-2">
              <button onClick={handleEnviar} disabled={loading}
                className="bg-[#18AD8F] font-bold text-white px-6 py-2 rounded-full hover:bg-[#149B80] hover:scale-105 transition duration-200">
                {loading ? "Enviando..." : "Enviar código"}
              </button>
            </div>
          </>
        ) : (
          // Confirmación — se muestra siempre aunque el correo no exista (seguridad)
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-500 flex items-center justify-center mx-auto mb-4 text-3xl">
              ✉️
            </div>
            <p className="text-gray-700 font-semibold mb-2">Revisa tu correo institucional</p>
            <p className="text-gray-500 text-sm mb-6">
              Si el correo está registrado, recibirás un código de 6 dígitos en tu bandeja de entrada.
              Revisa también tu carpeta de spam.
            </p>
            <Link to="/actualizarContrasena"
              className="inline-block bg-[#18AD8F] font-bold text-white px-6 py-2 rounded-full hover:bg-[#149B80] transition duration-200">
              Ingresar código
            </Link>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/" className="text-[#18AD8F] text-sm font-semibold hover:underline">
            ← Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export default RecuperarContrasena
