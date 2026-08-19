import { useState } from "react"
import { FaFileWord, FaCircleCheck, FaCircleXmark, FaRobot, FaSpinner } from "react-icons/fa6"

const SAPLING_KEY = "EZ4DLO7CAPGBKCQ2YW5IVT484JRCNWZI"

const EVIDENCIAS = [
  {
    alumno:    "Leslie Margarita Aranda",
    matricula: "25310157",
    documento: "Control de Horas",
    fecha:     "14 Ago 2026",
    texto:     "Durante mi servicio social en el programa Adopta a un Perro, realicé actividades de cuidado, alimentación y socialización de los animales en resguardo. Apoyé en campañas de adopción, elaboré fichas descriptivas de cada perro y coordiné visitas de familias interesadas. La experiencia me permitió desarrollar habilidades de organización, trabajo en equipo y responsabilidad social.",
  },
  {
    alumno:    "Nahomi Torres Escobar",
    matricula: "25310206",
    documento: "Reporte Final",
    fecha:     "15 Ago 2026",
    texto:     "El servicio social fue una experiencia de aprendizaje integral. Durante el período realicé diversas actividades relacionadas con el programa asignado, cumpliendo con los objetivos establecidos por la institución receptora. Las actividades desarrolladas contribuyeron significativamente a mi formación profesional y personal, permitiéndome aplicar los conocimientos adquiridos durante mi trayectoria académica en situaciones reales.",
  },
  {
    alumno:    "Luz Aracely Muñoz Perez",
    matricula: "25310130",
    documento: "Control de Horas",
    fecha:     "15 Ago 2026",
    texto:     "Participé activamente en el programa de servicio social, cumpliendo con el horario establecido y las actividades asignadas por mi supervisor. Entre las tareas realizadas se encuentran el apoyo administrativo, atención a usuarios y organización de materiales. La experiencia fortaleció mis competencias profesionales y me permitió contribuir positivamente a la institución receptora.",
  },
]

async function verificarIA(texto) {
  const res = await fetch("https://api.sapling.ai/api/v1/aidetect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: SAPLING_KEY, text: texto }),
  })
  if (!res.ok) throw new Error("Error al contactar la API")
  return (await res.json()).score
}

function EvidenciasPendientes() {
  const [estados, setEstados]   = useState({})
  const [scores, setScores]     = useState({})
  const [loading, setLoading]   = useState({})

  const validar = (id, status) =>
    setEstados(prev => ({ ...prev, [id]: status }))

  async function handleVerificarIA(i) {
    setLoading(prev => ({ ...prev, [i]: true }))
    try {
      const score = await verificarIA(EVIDENCIAS[i].texto)
      setScores(prev => ({ ...prev, [i]: score }))
      setEstados(prev => ({ ...prev, [i]: "ia_resultado" }))
    } catch {
      setEstados(prev => ({ ...prev, [i]: "ia_error" }))
    } finally {
      setLoading(prev => ({ ...prev, [i]: false }))
    }
  }

  return (
    <>
      <h2 className="text-3xl font-bold mb-6">Evidencias Pendientes</h2>
      <div className="flex flex-col gap-4">
        {EVIDENCIAS.map((e, i) => {
          const score    = scores[i]
          const pct      = score !== undefined ? Math.round(score * 100) : null
          const esIA     = pct !== null && pct >= 60
          const colorIA  = pct === null ? "" : pct >= 60 ? "text-red-600" : pct >= 40 ? "text-yellow-600" : "text-green-600"
          const etiqueta = pct === null ? "" : pct >= 60 ? "Alta probabilidad de IA" : pct >= 40 ? "Incierto" : "Probablemente humano"

          return (
            <div key={i} className={`bg-white rounded-xl shadow p-5 border-l-4 transition-all
              ${estados[i] === "aprobado"    ? "border-green-400" :
                estados[i] === "rechazado"   ? "border-red-400"   :
                estados[i] === "ia_resultado" ? (esIA ? "border-red-300" : "border-green-300") :
                "border-yellow-400"}`}>

              <div className="flex items-start gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FaFileWord size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-gray-800 truncate">{e.alumno}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{e.matricula}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{e.documento} · {e.fecha}</p>

                  {/* Resultado de IA */}
                  {estados[i] === "ia_resultado" && pct !== null && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${colorIA}`}>
                          🤖 {etiqueta} — {pct}% IA
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`h-2 rounded-full transition-all duration-700
                          ${pct >= 60 ? "bg-red-500" : pct >= 40 ? "bg-yellow-400" : "bg-green-500"}`}
                          style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )}
                  {estados[i] === "ia_error" && (
                    <p className="text-red-500 text-xs mt-2">Error al verificar con IA</p>
                  )}
                </div>
              </div>

              {/* Botones */}
              {estados[i] !== "aprobado" && estados[i] !== "rechazado" ? (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleVerificarIA(i)}
                    disabled={loading[i]}
                    className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 font-semibold px-3 py-2 rounded-lg hover:bg-purple-200 transition disabled:opacity-50">
                    {loading[i] ? <FaSpinner size={12} className="animate-spin" /> : <FaRobot size={12} />}
                    {loading[i] ? "Verificando..." : "Verificar IA"}
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
                  ${estados[i] === "aprobado" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {estados[i] === "aprobado" ? "✓ Aprobado" : "✗ Rechazado"}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

export default EvidenciasPendientes
