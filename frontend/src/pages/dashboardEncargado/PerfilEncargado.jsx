import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { FaUser, FaEnvelope, FaCalendarDays, FaPen, FaCheck, FaXmark } from "react-icons/fa6"
import { actividadesApi } from "../../services/api"

function PerfilEncargado() {
  const { user, setUser } = useOutletContext()
  const [actividades, setActividades]     = useState([])
  const [editando, setEditando]           = useState(false)
  const [nuevaActividad, setNuevaActividad] = useState("")
  const [guardando, setGuardando]         = useState(false)
  const [error, setError]                 = useState("")

  useEffect(() => {
    actividadesApi.getAll()
      .then(setActividades)
      .catch(() => {})
  }, [])

  const getInitials = (name = "") =>
    name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()

  const iniciarEdicion = () => {
    setNuevaActividad(user.actividad_id?.toString() || "")
    setEditando(true)
    setError("")
  }

  const cancelar = () => { setEditando(false); setError("") }

  const guardarActividad = async () => {
    if (!nuevaActividad) return setError("Seleccione una actividad")
    setGuardando(true)
    setError("")
    try {
      await actividadesApi.assignToSupervisor(parseInt(nuevaActividad))
      const act = actividades.find(a => a.id === parseInt(nuevaActividad))
      setUser(prev => ({
        ...prev,
        actividad_id: parseInt(nuevaActividad),
        assigned_activity: act?.nombre,
      }))
      const stored = JSON.parse(localStorage.getItem("user") || "null")
      if (stored) {
        localStorage.setItem("user", JSON.stringify({
          ...stored,
          actividad_id: parseInt(nuevaActividad),
          assigned_activity: act?.nombre,
        }))
      }
      setEditando(false)
    } catch (err) {
      setError(err.message || "No se pudo actualizar la actividad")
    } finally {
      setGuardando(false)
    }
  }

  return (
    <>
      <h2 className="text-3xl font-bold mb-6">Perfil</h2>
      <div className="flex justify-center">
        <div className="w-full max-w-xl bg-white rounded-xl shadow p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full bg-[#18AD8F] text-white flex items-center justify-center text-3xl font-bold mb-3">
              {getInitials(user.full_name)}
            </div>
            <h3 className="text-xl font-bold uppercase text-center">{user.full_name}</h3>
            <span className="text-sm text-white bg-[#18AD8F] px-3 py-1 rounded-full mt-2">Encargado de Proyecto</span>
          </div>

          <div className="divide-y divide-gray-100">
            <div className="flex items-center gap-4 py-4">
              <div className="w-10 h-10 rounded-full bg-[#18AD8F]/10 text-[#18AD8F] flex items-center justify-center flex-shrink-0">
                <FaUser size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Nombre completo</p>
                <p className="font-semibold">{user.full_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-4">
              <div className="w-10 h-10 rounded-full bg-[#18AD8F]/10 text-[#18AD8F] flex items-center justify-center flex-shrink-0">
                <FaEnvelope size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Correo institucional</p>
                <p className="font-semibold">{user.email || user.institutional_email}</p>
              </div>
            </div>

            {/* Actividad asignada editable */}
            <div className="flex items-center gap-4 py-4">
              <div className="w-10 h-10 rounded-full bg-[#18AD8F]/10 text-[#18AD8F] flex items-center justify-center flex-shrink-0">
                <FaCalendarDays size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400">Actividad asignada</p>
                {!editando ? (
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{user.assigned_activity || "Sin asignar"}</p>
                    <button onClick={iniciarEdicion} className="text-gray-400 hover:text-[#18AD8F] transition">
                      <FaPen size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-1">
                    <select value={nuevaActividad} onChange={(e) => setNuevaActividad(e.target.value)}
                      className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#18AD8F] flex-1">
                      <option value="" disabled>Seleccione una actividad</option>
                      {actividades.map(a => (
                        <option key={a.id} value={a.id}>{a.nombre}</option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button onClick={guardarActividad} disabled={guardando}
                        className="text-green-600 hover:text-green-700 transition disabled:opacity-50">
                        <FaCheck size={16} />
                      </button>
                      <button onClick={cancelar} disabled={guardando}
                        className="text-gray-400 hover:text-red-500 transition disabled:opacity-50">
                        <FaXmark size={16} />
                      </button>
                    </div>
                  </div>
                )}
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PerfilEncargado
