import { useState } from "react"
import { useOutletContext } from "react-router-dom"
import { usersApi } from "../../services/api"
import { FaClock } from "react-icons/fa6"

const MAX_HOURS = 48

function Horas() {
  const { user, setUser } = useOutletContext() || {}
  const [hours, setHours] = useState(user?.accumulated_hours ?? 0)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const percentage = Math.min(Math.round((hours / MAX_HOURS) * 100), 100)

  async function handleSave() {
    setMessage("")
    setError("")
    if (hours < 0 || hours > MAX_HOURS)
      return setError(`Las horas deben estar entre 0 y ${MAX_HOURS}`)

    setLoading(true)
    try {
      const data = await usersApi.updateHours(Number(hours))
      setUser((prev) => ({ ...prev, accumulated_hours: data.accumulated_hours }))
      setMessage("Horas actualizadas correctamente")
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h2 className = "text-3xl font-bold mb-6">Mis Horas</h2>

      <div className = "flex justify-center">
        <div className = "w-full max-w-xl space-y-6">

          <div className = "bg-white rounded-xl shadow p-6">
            <div className = "flex items-center gap-3 mb-4">
              <div className = "w-10 h-10 rounded-full bg-[#18AD8F]/10 text-[#18AD8F] flex items-center justify-center">
                <FaClock size = {20} />
              </div>
              <div>
                <p className = "text-sm text-gray-400"> Progreso del cuatrimestre </p>
                <p className = "text-2xl font-bold">
                  {hours} <span className = "text-base font-normal text-gray-400">/ {MAX_HOURS} hrs</span>
                </p>
              </div>
            </div>
            <div className = "w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div className = "h-4 rounded-full transition-all duration-500"
                style = {{ width: `${percentage}%`, backgroundColor: percentage >= 100 ? "#16a34a" : "#18AD8F" }} />
            </div>
            <div className = "flex justify-between text-xs text-gray-400 mt-1">
              <span>0 hrs</span>
              <span className = "font-semibold text-[#18AD8F]">{percentage}%</span>
              <span>{MAX_HOURS} hrs</span>
            </div>
            {percentage >= 100 && (
              <p className = "text-green-600 font-semibold text-sm mt-3 text-center">Cuatrimestre completado</p>
            )}
          </div>

          <div className = "bg-white rounded-xl shadow p-6">
            <h3 className = "font-semibold mb-4"> Actualizar horas registradas </h3>
            <label className = "block text-sm text-gray-500 mb-1"> Horas acumuladas (0 - {MAX_HOURS})</label>
            <input type = "number" min={0} max = {MAX_HOURS} value = {hours}
              onChange = {(e) => { setHours(e.target.value); setMessage(""); setError("") }}
              className = "w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#18AD8F] transition" />
            {error   && <p className = "text-red-500 text-sm mt-2">{error}</p>}
            {message && <p className = "text-green-600 text-sm mt-2">{message}</p>}
            <button onClick = {handleSave} disabled = {loading}
              className = "mt-4 w-full bg-[#18AD8F] text-white font-bold py-2 rounded-lg hover:bg-[#149B80] transition">
              {loading ? "Guardando..." : "Guardar horas"}
            </button>
          </div>

        </div>
      </div>
    </>
  )
}

export default Horas