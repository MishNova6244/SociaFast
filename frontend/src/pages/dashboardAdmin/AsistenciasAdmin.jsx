import { useState, useMemo } from "react"
import { FaCheck, FaXmark, FaClock, FaFilter } from "react-icons/fa6"

const ACTIVIDADES = [
  { value: "futbol_var",         label: "Fútbol 7 Varonil" },
  { value: "futbol_fem",         label: "Fútbol 7 Femenil" },
  { value: "voleibol",           label: "Voleibol" },
  { value: "baloncesto",         label: "Baloncesto" },
  { value: "tocho_bandera",      label: "Tocho Bandera" },
  { value: "box",                label: "Box"},
  { value: "atletismo",          label: "Atletismo" },
  { value: "canto",              label: "Canto" },
  { value: "banda_guerra",       label: "Banda de Guerra" },
  { value: "escolta",            label: "Escolta" },
  { value: "artes_plasticas",    label: "Artes Plásticas" },
  { value: "danza",              label: "Danza" },
  { value: "gestion_ambiental",  label: "Grupo de Gestión Ambiental y Orden 5S" },
  { value: "atencion_integral",  label: "Centro de Atención Integral al Estudiante"},
  { value: "extension_cultura",  label: "Grupo Auxiliar de Extensión y Cultura" },
  { value: "libros",             label: "Libros que Unen" },
  { value: "promotor",           label: "Promotor UT Paso del Norte" },
  { value: "auxiliar_admin",     label: "Auxiliar Administrativo del Depto. de Salud" },
  { value: "coyotes",            label: "Coyotes Guardianes" },
  { value: "alas_amor",          label: "Alas de Amor / Casa de Amor para Niños" },
  { value: "areas_verdes",       label: "Mantenimiento de Áreas Verdes en la UT Paso del Norte"},
  { value: "ayudante_deportes",  label: "Ayudante de Oficina Deportes" },
  { value: "arbitros",           label: "Árbitros Intramuros UTPN" },
  { value: "investigadores",     label: "Programa de Investigadores JR." },
  { value: "adopta_perro",       label: "Adopta a un Perro" },
]

const REGISTROS_ASISTENCIA = [
  { matricula: "25311001", nombre: "Ana López",      grupo: "TRM31", actividad: "Voleibol",   fecha: "2026-08-10", estado: "presente", encargado: "Juan Pérez López" },
  { matricula: "25310206", nombre: "Nahomi Torres",  grupo: "TRM31", actividad: "Voleibol",   fecha: "2026-08-10", estado: "ausente",  encargado: "Juan Pérez López" },
  { matricula: "25310304", nombre: "Juan Pérez",     grupo: "MTM22", actividad: "Baloncesto", fecha: "2026-08-10", estado: "presente", encargado: "María Solís" },
  { matricula: "25310158", nombre: "María García",   grupo: "TRM31", actividad: "Canto",      fecha: "2026-08-11", estado: "retardo",  encargado: "Carlos Núñez" },
  { matricula: "25310703", nombre: "Luis Torres",    grupo: "MTM22", actividad: "Danza",      fecha: "2026-08-11", estado: "presente", encargado: "Ana Beltrán" },
]

const ESTADOS = {
  presente: { label: "Presente", icon: <FaCheck size={12} />, color: "bg-green-100 text-green-700" },
  ausente:  { label: "Ausente",  icon: <FaXmark size={12} />, color: "bg-red-100 text-red-700" },
  retardo:  { label: "Retardo",  icon: <FaClock size={12} />, color: "bg-yellow-100 text-yellow-700" },
}

function AsistenciasAdmin() {
  const [filtroActividad, setFiltroActividad] = useState("")
  const [filtroEncargado, setFiltroEncargado] = useState("")
  const [filtroFecha, setFiltroFecha] = useState("")

  const encargados = useMemo(
    () => [...new Set(REGISTROS_ASISTENCIA.map(r => r.encargado))].sort(),
    []
  )

  const registrosFiltrados = useMemo(() => {
    return REGISTROS_ASISTENCIA.filter(r =>
      (filtroActividad ? r.actividad === filtroActividad : true) &&
      (filtroEncargado ? r.encargado === filtroEncargado : true) &&
      (filtroFecha ? r.fecha === filtroFecha : true)
    )
  }, [filtroActividad, filtroEncargado, filtroFecha])

  const totalPresentes = registrosFiltrados.filter(r => r.estado === "presente").length
  const totalAusentes = registrosFiltrados.filter(r => r.estado === "ausente").length
  const totalRetardos = registrosFiltrados.filter(r => r.estado === "retardo").length

  const limpiarFiltros = () => {
    setFiltroActividad("")
    setFiltroEncargado("")
    setFiltroFecha("")
  }

  return (
    <>
      <h2 className="text-3xl font-bold mb-6">Asistencias capturadas</h2>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <div className="flex items-center gap-2 mb-3 text-gray-600">
          <FaFilter size={14} />
          <h3 className="font-semibold">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <select value={filtroActividad} onChange={e => setFiltroActividad(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]">
            <option value="">Todas las actividades</option>
            {ACTIVIDADES.map(a => (
              <option key={a.value} value={a.label}>{a.label}</option>
            ))}
          </select>

          <select value={filtroEncargado} onChange={e => setFiltroEncargado(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]">
            <option value="">Todos los encargados</option>
            {encargados.map(enc => <option key={enc} value={enc}>{enc}</option>)}
          </select>

          <input
            type="date"
            value={filtroFecha}
            onChange={e => setFiltroFecha(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
          />

          <button onClick={limpiarFiltros}
            className="text-sm text-gray-500 hover:text-gray-700 underline text-left sm:text-center">
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-400 text-sm">Presentes</p>
          <p className="text-3xl font-bold mt-1 text-green-600">{totalPresentes}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-400 text-sm">Ausentes</p>
          <p className="text-3xl font-bold mt-1 text-red-600">{totalAusentes}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-400 text-sm">Retardos</p>
          <p className="text-3xl font-bold mt-1 text-yellow-600">{totalRetardos}</p>
        </div>
      </div>

      {/* Tabla de asistencias */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Registros</h3>
          <span className="text-sm text-gray-400">{registrosFiltrados.length} resultados</span>
        </div>
        <div className="overflow-x-auto w-full max-w-full">
          <table className="min-w-[750px] w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-gray-400 font-medium pb-3">Alumno</th>
                <th className="text-left text-gray-400 font-medium pb-3">Matrícula</th>
                <th className="text-left text-gray-400 font-medium pb-3">Grupo</th>
                <th className="text-left text-gray-400 font-medium pb-3">Actividad</th>
                <th className="text-left text-gray-400 font-medium pb-3">Fecha</th>
                <th className="text-center text-gray-400 font-medium pb-3">Estado</th>
                <th className="text-left text-gray-400 font-medium pb-3">Encargado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {registrosFiltrados.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="py-3 font-semibold text-gray-700">{r.nombre}</td>
                  <td className="py-3 text-gray-500">{r.matricula}</td>
                  <td className="py-3 text-gray-500">{r.grupo}</td>
                  <td className="py-3 text-gray-500">{r.actividad}</td>
                  <td className="py-3 text-gray-500">{r.fecha}</td>
                  <td className="py-3 text-center">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${ESTADOS[r.estado].color}`}>
                      {ESTADOS[r.estado].icon} {ESTADOS[r.estado].label}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500">{r.encargado}</td>
                </tr>
              ))}
              {registrosFiltrados.length === 0 && (
                <tr><td colSpan={7} className="py-6 text-center text-gray-400">Sin registros para los filtros aplicados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default AsistenciasAdmin