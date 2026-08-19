import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6"
import ResponsiveTable from "../../components/ResponsiveTable"

const REPORTES = [
  { alumno: "Ana García López",     matricula: "25310201", encargado: "Juan Pérez",  fecha: "28 Jul 2026" },
  { alumno: "Diana Torres Pérez",   matricula: "25310203", encargado: "Juan Pérez",  fecha: "30 Jul 2026" },
  { alumno: "Carlos Ruiz Martínez", matricula: "25310202", encargado: "María López", fecha: "31 Jul 2026" },
]

function ReportesPendientes() {
  const headers = [
    { key: "alumno",    label: "Alumno" },
    { key: "encargado", label: "Encargado" },
    { key: "fecha",     label: "Fecha" },
  ]

  const rows = REPORTES.map((r) => ({
    alumno:    <div><p className="font-semibold text-gray-700">{r.alumno}</p><p className="text-xs text-gray-400">{r.matricula}</p></div>,
    encargado: r.encargado,
    fecha:     r.fecha,
  }))

  return (
    <>
      <h2 className="text-3xl font-bold mb-6">Reportes Pendientes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-400 text-sm">Total pendientes</p>
          <p className="text-3xl font-bold mt-1 text-yellow-600">{REPORTES.length}</p>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <ResponsiveTable headers={headers} rows={rows}
          renderActions={() => (
            <div className="flex gap-2 flex-wrap justify-end">
              <button className="flex items-center gap-1 text-xs bg-green-100 text-green-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-green-200 transition whitespace-nowrap">
                <FaCircleCheck size={11} /> Aprobar
              </button>
              <button className="flex items-center gap-1 text-xs bg-red-100 text-red-600 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-200 transition whitespace-nowrap">
                <FaCircleXmark size={11} /> Rechazar
              </button>
            </div>
          )}
        />
      </div>
    </>
  )
}

export default ReportesPendientes
