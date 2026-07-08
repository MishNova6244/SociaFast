import { useState } from "react"
import { useOutletContext } from "react-router-dom"
import { usersApi } from "../../services/api"
import { FaClock } from "react-icons/fa6"

const META = 48

function Horas() {
  const { user, setUser } = useOutletContext() || {}
  const [horas, setHoras]     = useState(user?.horas_acumuladas ?? 0)
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState("")
  const [error, setError]     = useState("")

  const porcentaje = Math.min(Math.round((horas / META) * 100), 100)

  async function handleGuardar() {
    setMensaje("")
    setError("")

    if (horas < 0 || horas > META) {
      setError(`Las horas deben estar entre 0 y ${META}`)
      return
    }

    setLoading(true)
    try {
      const data = await usersApi.updateHoras(Number(horas))
      // Actualizar el contexto global para que Home y Perfil reflejen el cambio
      setUser((prev) => ({ ...prev, horas_acumuladas: data.horas_acumuladas }))
      setMensaje("Horas actualizadas correctamente")
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h2 className="text-3xl font-bold mb-6">Mis Horas</h2>

      <div className="max-w-xl space-y-6">

        {/* Tarjeta de progreso */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#18AD8F]/10 text-[#18AD8F] flex items-center justify-center">
              <FaClock size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Progreso del cuatrimestre</p>
              <p className="text-2xl font-bold">{horas} <span className="text-base font-normal text-gray-400">/ {META} hrs</span></p>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="h-4 rounded-full transition-all duration-500"
              style={{
                width: `${porcentaje}%`,
                backgroundColor: porcentaje >= 100 ? "#16a34a" : "#18AD8F",
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0 hrs</span>
            <span className="font-semibold text-[#18AD8F]">{porcentaje}%</span>
            <span>{META} hrs</span>
          </div>

          {porcentaje >= 100 && (
            <p className="text-green-600 font-semibold text-sm mt-3 text-center">
              Cuatrimestre completado
            </p>
          )}
        </div>

        {/* Formulario para actualizar horas */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-4">Actualizar horas registradas</h3>

          <label className="block text-sm text-gray-500 mb-1">
            Horas acumuladas (0 - {META})
          </label>
          <input
            type="number"
            min={0}
            max={META}
            value={horas}
            onChange={(e) => {
              setHoras(e.target.value)
              setMensaje("")
              setError("")
            }}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#18AD8F] transition"
          />

          {error   && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {mensaje && <p className="text-green-600 text-sm mt-2">{mensaje}</p>}

          <button
            onClick={handleGuardar}
            disabled={loading}
            className="mt-4 w-full bg-[#18AD8F] text-white font-bold py-2 rounded-lg hover:bg-[#149B80] transition"
          >
            {loading ? "Guardando..." : "Guardar horas"}
          </button>
        </div>

      </div>
    </>
  )
}

export default Horas