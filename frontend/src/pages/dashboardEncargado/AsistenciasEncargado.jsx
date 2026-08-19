import { useState, useMemo } from "react"
import { useOutletContext } from "react-router-dom"
import { FaCheck, FaXmark, FaClock } from "react-icons/fa6"

// Datos temporales
const ALUMNOS = [
  { matricula: "25310206", nombre: "Ana López",     grupo: "TRM31", actividad: "Voleibol" },
  { matricula: "25310204", nombre: "Juan Pérez",    grupo: "TRM31", actividad: "Voleibol" },
  { matricula: "25318421", nombre: "María García",  grupo: "MTM22", actividad: "Voleibol" },
  { matricula: "25319826", nombre: "Luis Torres",   grupo: "MTM22", actividad: "Baloncesto" },
  { matricula: "25317632", nombre: "Sofía Ramírez", grupo: "TRM31", actividad: "Baloncesto" },
]

const REGISTROS_GUARDADOS = [
  { matricula: "25310206", nombre: "Ana López",  grupo: "TRM31", actividad: "Voleibol", fecha: "2026-08-10", estado: "presente" },
  { matricula: "25310204", nombre: "Juan Pérez", grupo: "TRM31", actividad: "Voleibol", fecha: "2026-08-10", estado: "ausente" },
  { matricula: "25318421", nombre: "María García", grupo: "MTM22", actividad: "Voleibol", fecha: "2026-08-12", estado: "presente" },
]

const ESTADOS = [
  { value: "presente", label: "Presente", icon: <FaCheck size={14} />, color: "bg-green-500 text-white" },
  { value: "ausente",  label: "Ausente",  icon: <FaXmark size={14} />, color: "bg-red-500 text-white" },
  { value: "retardo",  label: "Retardo",  icon: <FaClock size={14} />, color: "bg-yellow-500 text-white" },
]

const ESTADOS_BADGE = {
  presente: { label: "Presente", icon: <FaCheck size={12} />, color: "bg-green-100 text-green-700" },
  ausente:  { label: "Ausente",  icon: <FaXmark size={12} />, color: "bg-red-100 text-red-700" },
  retardo:  { label: "Retardo",  icon: <FaClock size={12} />, color: "bg-yellow-100 text-yellow-700" },
}

function Asistencias() {
  const { user } = useOutletContext()
  const actividadAsignada = user?.assigned_activity || ""

  const [fecha, setFecha] = useState(() => new Date().toISOString().split("T")[0])
  const [filtroGrupo, setFiltroGrupo] = useState("")
  const [filtroMatricula, setFiltroMatricula] = useState("")
  const [asistencia, setAsistencia] = useState({})
  const [guardado, setGuardado] = useState(false)

  // Filtro del historial
  const [filtroFechaHistorial, setFiltroFechaHistorial] = useState("")

  const grupos = useMemo(
    () => [...new Set(ALUMNOS.filter(a => a.actividad === actividadAsignada).map(a => a.grupo))].sort(),
    [actividadAsignada]
  )

  const alumnosFiltrados = useMemo(() => {
    return ALUMNOS.filter(a =>
      a.actividad === actividadAsignada &&
      (filtroGrupo ? a.grupo === filtroGrupo : true) &&
      (filtroMatricula ? a.matricula.includes(filtroMatricula.trim()) : true)
    )
  }, [actividadAsignada, filtroGrupo, filtroMatricula])

  const marcar = (matricula, estado) => {
    setAsistencia(prev => {
      const actual = prev[matricula]
      const nuevos = { ...prev }
      if (actual === estado) {
        delete nuevos[matricula]
      } else {
        nuevos[matricula] = estado
      }
      return nuevos
    })
    setGuardado(false)
  }

  const marcarTodos = (estado) => {
    const nuevos = {}
    alumnosFiltrados.forEach(a => { nuevos[a.matricula] = estado })
    setAsistencia(prev => ({ ...prev, ...nuevos }))
    setGuardado(false)
  }

  const guardarAsistencia = () => {
    const registro = alumnosFiltrados.map(a => ({
      matricula: a.matricula,
      nombre: a.nombre,
      actividad: actividadAsignada,
      fecha,
      estado: asistencia[a.matricula] || "sin marcar",
    }))
    console.log("Guardar en backend:", registro)
    setGuardado(true)
  }

  const marcadosCount = alumnosFiltrados.filter(a => asistencia[a.matricula]).length

  // Historial: solo registros de la actividad asignada del encargado
  const historialFiltrado = useMemo(() => {
    return REGISTROS_GUARDADOS.filter(r =>
      r.actividad === actividadAsignada &&
      (filtroFechaHistorial ? r.fecha === filtroFechaHistorial : true)
    )
  }, [actividadAsignada, filtroFechaHistorial])

  if (!actividadAsignada) {
    return (
      <>
        <h2 className="text-3xl font-bold mb-6">Captura de Asistencias</h2>
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 text-yellow-800 text-sm">
          Aún no tienes una actividad asignada. Ve a tu perfil para seleccionar una antes de capturar asistencias.
        </div>
      </>
    )
  }

  return (
    <>
      <h2 className="text-3xl font-bold mb-6">Captura de Asistencias</h2>

      {/* Actividad fija según su actividad asignada */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Actividad asignada</label>
            <p className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 font-semibold">
              {actividadAsignada}
            </p>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Grupo</label>
            <select
              value={filtroGrupo}
              onChange={e => setFiltroGrupo(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
            >
              <option value="">Todos los grupos</option>
              {grupos.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Buscar matrícula</label>
            <input
              type="text"
              placeholder="Ej. 25310154"
              value={filtroMatricula}
              onChange={e => setFiltroMatricula(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
            />
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="flex flex-col sm:flex-row sm:items-center items-center gap-3 mb-4">
        <span className="text-sm text-gray-500">Marcar todos como:</span>
        <div className="flex flex-wrap gap-3">
          {ESTADOS.map(({ value, label, icon, color }) => (
            <button
              key={value}
              onClick={() => marcarTodos(value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${color} hover:opacity-90 transition`}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de alumnos para capturar */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">{actividadAsignada}</h3>
          <span className="text-sm text-gray-400">{marcadosCount} / {alumnosFiltrados.length} marcados</span>
        </div>

        <div className="divide-y divide-gray-100">
          {alumnosFiltrados.map(a => (
            <div key={a.matricula} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3">
              <div>
                <p className="font-semibold text-gray-700">{a.nombre}</p>
                <p className="text-xs text-gray-400">{a.matricula} · {a.grupo}</p>
              </div>

              <div className="flex gap-2">
                {ESTADOS.map(({ value, label, icon, color }) => {
                  const activo = asistencia[a.matricula] === value
                  return (
                    <button
                      key={value}
                      onClick={() => marcar(a.matricula, value)}
                      title={label}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition
                        ${activo ? color + " border-transparent" : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"}`}
                    >
                      {icon}
                      <span className="hidden sm:inline">{label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          {alumnosFiltrados.length === 0 && (
            <p className="text-center text-gray-400 py-6">No hay alumnos con los filtros aplicados</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          {guardado && <span className="text-sm text-green-600">Asistencia guardada ✓</span>}
          <button
            onClick={guardarAsistencia}
            disabled={alumnosFiltrados.length === 0}
            className="bg-[#1A3A5C] hover:bg-[#142d47] disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg font-semibold transition"
          >
            Guardar asistencia
          </button>
        </div>
      </div>

      {/* Tabla de asistencias ya capturadas */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="font-semibold text-lg">Historial de asistencias — {actividadAsignada}</h3>
          <input
            type="date"
            value={filtroFechaHistorial}
            onChange={e => setFiltroFechaHistorial(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
          />
        </div>

        <div className="overflow-x-auto w-full max-w-full">
          <table className="min-w-[600px] w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-gray-400 font-medium pb-3">Alumno</th>
                <th className="text-left text-gray-400 font-medium pb-3">Matrícula</th>
                <th className="text-left text-gray-400 font-medium pb-3">Grupo</th>
                <th className="text-left text-gray-400 font-medium pb-3">Fecha</th>
                <th className="text-center text-gray-400 font-medium pb-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {historialFiltrado.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="py-3 font-semibold text-gray-700">{r.nombre}</td>
                  <td className="py-3 text-gray-500">{r.matricula}</td>
                  <td className="py-3 text-gray-500">{r.grupo}</td>
                  <td className="py-3 text-gray-500">{r.fecha}</td>
                  <td className="py-3 text-center">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${ESTADOS_BADGE[r.estado].color}`}>
                      {ESTADOS_BADGE[r.estado].icon} {ESTADOS_BADGE[r.estado].label}
                    </span>
                  </td>
                </tr>
              ))}
              {historialFiltrado.length === 0 && (
                <tr><td colSpan={5} className="py-6 text-center text-gray-400">Sin registros aún</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Asistencias