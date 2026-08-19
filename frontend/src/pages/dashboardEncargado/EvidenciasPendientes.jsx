import { useState } from "react"
import { FaFileWord, FaCircleCheck, FaCircleXmark, FaRobot } from "react-icons/fa6"

const EVIDENCIAS = [
  { alumno: "Ana García López",     matricula: "25310201", documento: "Control de Horas",       fecha: "28 Jul 2026" },
  { alumno: "Carlos Ruiz Martínez", matricula: "25310202", documento: "Evaluación de Desempeño", fecha: "29 Jul 2026" },
  { alumno: "Diana Torres Pérez",   matricula: "25310203", documento: "Reporte Final",           fecha: "30 Jul 2026" },
]

function EvidenciasPendientes() {
  const [estados, setEstados] = useState({})
  const validar = (id, status) => setEstados(prev => ({ ...prev, [id]: status }))

  return (
    <>
      <h2 className="text-3xl font-bold mb-6">Evidencias Pendientes</h2>
      <div className="flex flex-col gap-4">
        {EVIDENCIAS.map((e, i) => (
          <div key={i} className={`bg-white rounded-xl shadow p-5 border-l-4 transition-all
            ${estados[i] === "aprobado" ? "border-green-400" :
              estados[i] === "rechazado" ? "border-red-400" : "border-yellow-400"}`}>

            {/* Info del alumno */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <FaFileWord size={18} />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-gray-800 truncate">{e.alumno}</p>
                <p className="text-xs text-gray-400 mt-0.5">{e.matricula}</p>
                <p className="text-xs text-gray-500 mt-0.5">{e.documento} · {e.fecha}</p>
              </div>
            </div>

            {/* Botones de acción */}
            {!estados[i] ? (
              <div className="flex flex-wrap gap-2">
                <button onClick={() => validar(i, "ia_pendiente")}
                  className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 font-semibold px-3 py-2 rounded-lg hover:bg-purple-200 transition">
                  <FaRobot size={12} /> Verificar IA
                </button>
                <button onClick={() => validar(i, "aprobado")}
                  className="flex items-center gap-1 text-xs bg-green-100 text-green-700 font-semibold px-3 py-2 rounded-lg hover:bg-green-200 transition">
                  <FaCircleCheck size={12} /> Aprobar
                </button>
                <button onClick={() => validar(i, "rechazado")}
                  className="flex items-center gap-1 text-xs bg-red-100 text-red-600 font-semibold px-3 py-2 rounded-lg hover:bg-red-200 transition">
                  <FaCircleXmark size={12} /> Rechazar
                </button>
              </div>
            ) : (
              <span className={`inline-block text-xs font-bold px-3 py-1.5 rounded-full
                ${estados[i] === "aprobado" ? "bg-green-100 text-green-700" :
                  estados[i] === "rechazado" ? "bg-red-100 text-red-600" :
                  "bg-purple-100 text-purple-700"}`}>
                {estados[i] === "aprobado" ? "✓ Aprobado" :
                 estados[i] === "rechazado" ? "✗ Rechazado" : "⏳ Verificando IA..."}
              </span>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

export default EvidenciasPendientes
