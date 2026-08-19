import { useState, useEffect } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import { FaMagnifyingGlass, FaCircleCheck, FaHourglass } from "react-icons/fa6"
import { actividadesApi } from "../../services/api"

function StatusBadge({ status }) {
  return status === "completado"
    ? <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full whitespace-nowrap"><FaCircleCheck size={11} /> Completado</span>
    : <span className="flex items-center gap-1 text-xs font-semibold text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full whitespace-nowrap"><FaHourglass size={11} /> En progreso</span>
}

function Alumnos() {
  const navigate = useNavigate()
  const { user } = useOutletContext()
  const [alumnos, setAlumnos]   = useState([])
  const [search, setSearch]     = useState("")
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState("")

  const actividadId      = user?.actividad_id
  const actividadAsignada = user?.assigned_activity || "Sin actividad asignada"

  useEffect(() => {
    if (!actividadId) { setLoading(false); return }
    actividadesApi.getStudents(actividadId)
      .then(data => setAlumnos(data))
      .catch(() => setError("No se pudieron cargar los alumnos"))
      .finally(() => setLoading(false))
  }, [actividadId])

  const filtered = alumnos.filter(a =>
    `${a.first_name} ${a.paternal_surname}`.toLowerCase().includes(search.toLowerCase()) ||
    a.student_id.includes(search) ||
    (a.grupo || "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <h2 className="text-3xl font-bold mb-6">Alumnos Registrados</h2>

      <div className="bg-green-50 border border-green-300 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <div className="flex items-start sm:items-center gap-3">
          <FaCircleCheck className="text-green-500 shrink-0 mt-0.5 sm:mt-0" size={20} />
          <p className="text-sm text-green-800">
            Actividad asignada: <strong>{actividadAsignada}</strong>
          </p>
        </div>
        <button onClick={() => navigate("/dashboardEncargado/perfil")}
          className="text-sm bg-green-500 text-white font-semibold px-4 py-1.5 rounded-lg hover:bg-green-600 transition shrink-0">
          Cambiar actividad
        </button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-400 text-sm">Total alumnos</p>
          <p className="text-3xl font-bold mt-1">{alumnos.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-400 text-sm">Con 48 horas</p>
          <p className="text-3xl font-bold mt-1 text-green-600">
            {alumnos.filter(a => a.accumulated_hours >= 48).length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-400 text-sm">En progreso</p>
          <p className="text-3xl font-bold mt-1 text-yellow-600">
            {alumnos.filter(a => a.accumulated_hours < 48).length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        {!actividadId ? (
          <p className="text-center text-gray-400 py-8">
            Asigna una actividad en tu perfil para ver los alumnos registrados.
          </p>
        ) : loading ? (
          <p className="text-center text-gray-400 py-8">Cargando alumnos...</p>
        ) : error ? (
          <p className="text-center text-red-500 py-8">{error}</p>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4 border border-gray-200 rounded-lg px-3 py-2">
              <FaMagnifyingGlass size={16} className="text-gray-400" />
              <input type="text" placeholder="Buscar por nombre, matrícula o grupo..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="flex-1 outline-none text-sm" />
            </div>
            <div className="overflow-x-auto w-full">
              <table className="min-w-[600px] w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left text-gray-400 font-medium pb-3">Alumno</th>
                    <th className="text-left text-gray-400 font-medium pb-3">Matrícula</th>
                    <th className="text-left text-gray-400 font-medium pb-3">Grupo</th>
                    <th className="text-center text-gray-400 font-medium pb-3">Horas</th>
                    <th className="text-center text-gray-400 font-medium pb-3">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((a) => (
                    <tr key={a.student_id} className="hover:bg-gray-50 transition">
                      <td className="py-3 font-semibold text-gray-700">{a.first_name} {a.paternal_surname}</td>
                      <td className="py-3 text-gray-500">{a.student_id}</td>
                      <td className="py-3 text-gray-500">{a.grupo || "—"}</td>
                      <td className="py-3 text-center font-bold text-[#18AD8F]">{a.accumulated_hours}/48</td>
                      <td className="py-3 text-center">
                        <StatusBadge status={a.accumulated_hours >= 48 ? "completado" : "en_progreso"} />
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={5} className="py-8 text-center text-gray-400">Sin alumnos registrados</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default Alumnos
