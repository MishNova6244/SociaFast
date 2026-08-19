import { useState, useMemo } from "react"
import { FaUsers, FaClock, FaFileLines, FaChartBar, FaFileExcel, FaFilter } from "react-icons/fa6"
import ModalFichaAlumno from "../../components/ModalFichaAlumno"
// Librería para generar documentos .xlsx (Excel)
import * as XLSX from "xlsx"

const ACTIVIDADES = [
  { name: "Voleibol",        carreras: ["Mecatrónica", "Industrial"] },
  { name: "Baloncesto",      carreras: ["Tecnologías", "Logística"] },
  { name: "Canto",           carreras: ["Arquitectura", "Administración"] },
  { name: "Danza",           carreras: ["Contaduría", "Mecatrónica"] },
  { name: "Banda de Guerra", carreras: ["Industrial", "Tecnologías"] },
]

// Datos de los alumnos
const ALUMNOS = [
  { matricula: "25311001", nombre: "Ana López",      genero: "F", grupo: "TRM31", carrera: "Tecnologías", cuatrimestre: 3, actividad: "Voleibol",        completado: true,  horasCompletadas: 48, horasTotales: 48 },
  { matricula: "25310206", nombre: "Nahomi Torres",  genero: "F", grupo: "TRM31", carrera: "Tecnologías", cuatrimestre: 3, actividad: "Voleibol",        completado: false, horasCompletadas: 22, horasTotales: 48 },
  { matricula: "25310304", nombre: "Juan Pérez",     genero: "M", grupo: "MTM22", carrera: "Industrial",  cuatrimestre: 3, actividad: "Baloncesto",      completado: false, horasCompletadas: 24, horasTotales: 48 },
  { matricula: "25310158", nombre: "María García",   genero: "F", grupo: "TRM31", carrera: "Tecnologías", cuatrimestre: 5, actividad: "Canto",           completado: true,  horasCompletadas: 48, horasTotales: 48 },
  { matricula: "25310703", nombre: "Luis Torres",    genero: "M", grupo: "MTM22", carrera: "Industrial",  cuatrimestre: 1, actividad: "Danza",           completado: false, horasCompletadas: 48, horasTotales: 48 },
  { matricula: "25310502", nombre: "Sofía Ramírez",  genero: "F", grupo: "IND22", carrera: "Logística",   cuatrimestre: 5, actividad: "Banda de Guerra", completado: true,  horasCompletadas: 16, horasTotales: 48 },

]

function Estadisticas() {
  // --- Estados de los filtros y selección de alumnos ---
  const [filtroGenero, setFiltroGenero] = useState("")
  const [filtroGrupo, setFiltroGrupo] = useState("")
  const [filtroMatricula, setFiltroMatricula] = useState("")
  const [filtroActividad, setFiltroActividad] = useState("")
  const [alumnosActividad, setAlumnosActividad] = useState(null)

  // Listas únicas para llenar los <select>
  const grupos = useMemo(() => [...new Set(ALUMNOS.map(a => a.grupo))].sort(), [])

  // --- Alumnos filtrados según las variables de arriba ---
  const alumnosFiltrados = useMemo(() => {
    return ALUMNOS.filter(a =>
      (filtroGenero ? a.genero === filtroGenero : true) &&
      (filtroGrupo ? a.grupo === filtroGrupo : true) &&
      (filtroMatricula ? a.matricula.includes(filtroMatricula.trim()) : true) &&
      (filtroActividad ? a.actividad === filtroActividad : true)
    )
  }, [filtroGenero, filtroGrupo, filtroMatricula, filtroActividad])

  // --- Estadísticas recalculadas según lo filtrado ---
  const totalAlumnos = alumnosFiltrados.length
  const totalCompletados = alumnosFiltrados.filter(a => a.completado).length

  // Actividades conteadas (alumnos + completados) a partir de alumnosFiltrados
  const actividadesConteo = useMemo(() => {
    return ACTIVIDADES.map(act => {
      const alumnosAct = alumnosFiltrados.filter(a => a.actividad === act.name)
      return {
        ...act,
        alumnos: alumnosAct.length,
        completados: alumnosAct.filter(a => a.completado).length,
      }
    }).filter(act => act.alumnos > 0) // Oculta actividades sin alumnos tras filtrar
  }, [alumnosFiltrados])

  // Cantidad de alumnos por cuatrimestre
  const porCuatrimestre = useMemo(() => {
    const conteo = {}
    alumnosFiltrados.forEach(a => {
      conteo[a.cuatrimestre] = (conteo[a.cuatrimestre] || 0) + 1
    })
    return Object.entries(conteo).sort(([a], [b]) => a - b)
  }, [alumnosFiltrados])

  // --- Exportar a Excel ---
  const exportarExcel = () => {
    const datos = alumnosFiltrados.map(a => ({
      Matrícula: a.matricula,
      Nombre: a.nombre,
      Género: a.genero,
      Grupo: a.grupo,
      Cuatrimestre: a.cuatrimestre,
      Carrera: a.carrera,
      Actividad: a.actividad,
      Estado: a.completado ? "Completado" : "En progreso",
    }))
    const hoja = XLSX.utils.json_to_sheet(datos)
    const libro = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(libro, hoja, "Estadísticas")
    XLSX.writeFile(libro, "estadisticas_alumnos.xlsx")
  }

  const limpiarFiltros = () => {
    setFiltroGenero("")
    setFiltroGrupo("")
    setFiltroMatricula("")
    setFiltroActividad("")
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-3xl font-bold">Historial y Estadísticas</h2>
        <button
          onClick={exportarExcel}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
        >
          <FaFileExcel size={20} />
          Exportar a Excel
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <div className="flex items-center gap-2 mb-3 text-gray-600">
          <FaFilter size={14} />
          <h3 className="font-semibold">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <input
            type="text"
            placeholder="Buscar por matrícula"
            value={filtroMatricula}
            onChange={e => setFiltroMatricula(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]"
          />

          <select value={filtroGenero} onChange={e => setFiltroGenero(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]">
            <option value="">Todos los géneros</option>
            <option value="F">Femenino</option>
            <option value="M">Masculino</option>
          </select>

          <select value={filtroGrupo} onChange={e => setFiltroGrupo(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]">
            <option value="">Todos los grupos</option>
            {grupos.map(g => <option key={g} value={g}>{g}</option>)}
          </select>

          <select value={filtroActividad} onChange={e => setFiltroActividad(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]">
            <option value="">Todas las disciplinas</option>
            {ACTIVIDADES.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
          </select>

          <button onClick={limpiarFiltros}
            className="text-sm text-gray-500 hover:text-gray-700 underline">
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Resumen general */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        {[
          { icon: <FaUsers size={20} />,     label: "Total alumnos",    value: totalAlumnos,                    color: "text-[#1A3A5C]" },
          { icon: <FaFileLines size={20} />, label: "Completados",      value: totalCompletados,                color: "text-green-600" },
          { icon: <FaClock size={20} />,     label: "En progreso",      value: totalAlumnos - totalCompletados, color: "text-yellow-600" },
          { icon: <FaChartBar size={20} />,  label: "Actividades",      value: actividadesConteo.length,        color: "text-purple-600" },
        ].map(({ icon, label, value, color }, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-5">
            <div className="flex items-center gap-2 mb-2 text-gray-400">{icon}<p className="text-sm">{label}</p></div>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Alumnos por cuatrimestre */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h3 className="font-semibold text-lg mb-4">Alumnos por cuatrimestre</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {porCuatrimestre.map(([cuatri, cantidad]) => (
            <div key={cuatri} className="text-center bg-gray-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-[#1A3A5C]">{cantidad}</p>
              <p className="text-xs text-gray-400">{cuatri}° cuatrimestre</p>
            </div>
          ))}
          {porCuatrimestre.length === 0 && (
            <p className="text-sm text-gray-400 col-span-full text-center">Sin resultados para los filtros aplicados</p>
          )}
        </div>
      </div>

      {/* Tabla de estadísticas por actividad */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-semibold text-lg mb-4">Alumnos por actividad</h3>
        <div className="overflow-x-auto w-full max-w-full">
          <table className="min-w-[700px] w-full text-xs sm:text-sm md:text-base">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-gray-400 font-medium pb-3">Disciplina</th>
                <th className="text-center text-gray-400 font-medium pb-3">Total</th>
                <th className="text-center text-gray-400 font-medium pb-3">Completados</th>
                <th className="text-center text-gray-400 font-medium pb-3">Progreso</th>
                <th className="text-left text-gray-400 font-medium pb-3">Carreras</th>
                <th className="text-center text-gray-400 font-medium pb-3">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {actividadesConteo.map((a, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="py-3 font-semibold text-gray-700">{a.name}</td>
                  <td className="py-3 text-center font-bold text-gray-700">{a.alumnos}</td>
                  <td className="py-3 text-center font-bold text-green-600">{a.completados}</td>
                  <td className="py-3 px-6">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="h-2 rounded-full bg-[#1A3A5C] transition-all"
                        style={{ width: `${Math.round((a.completados / a.alumnos) * 100)}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1 text-center">
                      {Math.round((a.completados / a.alumnos) * 100)}%
                    </p>
                  </td>
                  <td className="py-3 text-gray-400 text-xs">{a.carreras.join(", ")}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => {
                        // Busca el o los alumno(s) de esta actividad dentro de alumnosFiltrados
                        const alumnosDeEstaActividad = alumnosFiltrados.filter(al => al.actividad === a.name)
                        setAlumnosActividad(alumnosDeEstaActividad)
                      }}
                      className="text-xs bg-[#18AD8F] text-white px-3 py-1.5 rounded-lg hover:bg-[#149B80] transition"
                    >
                      Ver ficha de alumno
                    </button>
                  </td>
                </tr>
              ))}
              {actividadesConteo.length === 0 && (
                <tr><td colSpan={6} className="py-6 text-center text-gray-400">Sin resultados para los filtros aplicados</td></tr>
              )}
            </tbody>
          </table>
        </div>  
          <ModalFichaAlumno
            alumnos={alumnosActividad}
            onClose={() => setAlumnosActividad(null)}
          />
      </div>

      {/* Tabla de detalles (información del documento .xlsx) */}
      <div className="bg-white rounded-xl shadow p-6 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Detalles de los alumnos</h3>
          <span className="text-sm text-gray-400">{alumnosFiltrados.length} resultados</span>
        </div>
        <div className="overflow-x-auto w-full max-w-full">
          <table className="min-w-[700px] w-full text-xs sm:text-sm md:text-base">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-gray-400 font-medium pb-3">Matrícula</th>
                <th className="text-left text-gray-400 font-medium pb-3">Nombre</th>
                <th className="text-center text-gray-400 font-medium pb-3">Género</th>
                <th className="text-center text-gray-400 font-medium pb-3">Grupo</th>
                <th className="text-center text-gray-400 font-medium pb-3">Cuatrimestre</th>
                <th className="text-center text-gray-400 font-medium pb-3">Carrera</th>
                <th className="text-left text-gray-400 font-medium pb-3">Disciplina</th>
                <th className="text-center text-gray-400 font-medium pb-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {alumnosFiltrados.map((a) => (
                <tr key={a.matricula} className="hover:bg-gray-50 transition">
                  <td className="py-3 font-semibold text-gray-700">{a.matricula}</td>
                  <td className="py-3 text-gray-700">{a.nombre}</td>
                  <td className="py-3 text-center text-gray-500">{a.genero}</td>
                  <td className="py-3 text-center text-gray-500">{a.grupo}</td>
                  <td className="py-3 text-center text-gray-500">{a.cuatrimestre}°</td>
                  <td className="py-3 text-center text-gray-500">{a.carrera}</td>
                  <td className="py-3 text-gray-500">{a.actividad}</td>
                  <td className="py-3 text-center">
                    <span className={`font-semibold ${a.completado ? "text-green-600" : "text-yellow-600"}`}>
                      {a.completado ? "Completado" : "En progreso"}
                    </span>
                  </td>
                </tr>
              ))}
              {alumnosFiltrados.length === 0 && (
                <tr><td colSpan={8} className="py-6 text-center text-gray-400">Sin resultados para los filtros aplicados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Estadisticas
