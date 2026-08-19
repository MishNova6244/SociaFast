import { useState } from "react"
import { FaFileLines, FaCircleCheck, FaCircleXmark, FaRobot, FaCommentDots, FaCheck, FaSpinner, FaEye, FaPen } from "react-icons/fa6"
import TextArea from "../../components/TextArea"

const SAPLING_KEY = "EZ4DLO7CAPGBKCQ2YW5IVT484JRCNWZI"

// Firma SVG del encargado
const FIRMA_SVG = `<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
  <path d="M20,60 C30,20 50,10 70,40 C80,55 90,30 110,35 C130,40 140,55 160,45 C170,40 175,50 180,55"
    stroke="#1A3A5C" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M60,65 L90,65" stroke="#1A3A5C" stroke-width="1.5" stroke-linecap="round"/>
  <text x="55" y="78" font-family="Arial" font-size="8" fill="#1A3A5C" opacity="0.6">Encargado UTPN</text>
</svg>`

const REPORTES = [
  {
    alumno:    "Leslie Margarita Aranda",
    matricula: "25310157",
    fecha:     "14 Ago 2026",
    tipo:      "Control de Horas",
    texto:     "Durante mi servicio social en el programa Adopta a un Perro, realicé actividades de cuidado, alimentación y socialización de los animales en resguardo. Apoyé en campañas de adopción, elaboré fichas descriptivas de cada perro y coordiné visitas de familias interesadas. La experiencia me permitió desarrollar habilidades de organización, trabajo en equipo y responsabilidad social.",
  },
  {
    alumno:    "Nahomi Torres Escobar",
    matricula: "25310206",
    fecha:     "15 Ago 2026",
    tipo:      "Reporte Final",
    texto:     "El servicio social fue una experiencia de aprendizaje integral. Durante el período realicé diversas actividades relacionadas con el programa asignado, cumpliendo con los objetivos establecidos por la institución receptora. Las actividades desarrolladas contribuyeron significativamente a mi formación profesional y personal.",
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

function ModalDocumento({ reporte, firmado, onCerrar, onFirmar }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">{reporte.tipo} — {reporte.alumno}</h3>
          <button onClick={onCerrar} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
        </div>

        <div className="overflow-y-auto p-6 flex-1">
          {/* Encabezado del documento */}
          <div className="text-center mb-6 pb-4 border-b border-gray-200">
            <p className="font-bold text-[#1A3A5C] text-lg">UNIVERSIDAD TECNOLÓGICA PASO DEL NORTE</p>
            <p className="text-sm text-gray-500 mt-1">{reporte.tipo} de Servicio Social</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div><span className="text-gray-400">Alumno:</span> <span className="font-semibold">{reporte.alumno}</span></div>
            <div><span className="text-gray-400">Matrícula:</span> <span className="font-semibold">{reporte.matricula}</span></div>
            <div><span className="text-gray-400">Fecha:</span> <span className="font-semibold">{reporte.fecha}</span></div>
            <div><span className="text-gray-400">Programa:</span> <span className="font-semibold">Adopta a un Perro</span></div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-xs text-gray-400 mb-2 font-semibold uppercase">Descripción de actividades</p>
            <p className="text-sm text-gray-700 leading-relaxed">{reporte.texto}</p>
          </div>

          {/* Sección de firma */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-end">
              <div className="text-center">
                <div className="w-48 border-b border-gray-400 mb-1 h-16 flex items-end justify-center pb-1">
                  <p className="text-xs text-gray-300">Firma del alumno</p>
                </div>
                <p className="text-xs text-gray-500">{reporte.alumno}</p>
              </div>
              <div className="text-center">
                <div className="w-48 border-b border-gray-400 mb-1 h-16 flex items-end justify-center pb-1">
                  {firmado ? (
                    <div dangerouslySetInnerHTML={{ __html: FIRMA_SVG }} className="w-40" />
                  ) : (
                    <p className="text-xs text-gray-300">Firma del encargado</p>
                  )}
                </div>
                <p className="text-xs text-gray-500">Encargado UTPN</p>
                {firmado && <p className="text-xs text-green-600 font-semibold mt-0.5">✓ Firmado digitalmente</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onCerrar}
            className="border border-gray-300 text-gray-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition text-sm">
            Cerrar
          </button>
          {!firmado && (
            <button onClick={onFirmar}
              className="flex items-center gap-2 bg-[#18AD8F] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#149B80] transition text-sm">
              <FaPen size={13} /> Firmar documento
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function ReportesFirmar() {
  const [estados, setEstados]       = useState({})
  const [scores, setScores]         = useState({})
  const [loadingIA, setLoadingIA]   = useState({})
  const [comentarios, setComentarios] = useState({})
  const [activo, setActivo]         = useState({})
  const [guardado, setGuardado]     = useState({})
  const [errores, setErrores]       = useState({})
  const [modalIdx, setModalIdx]     = useState(null)

  const firmar = (id) => setEstados(prev => ({ ...prev, [id]: "firmado" }))
  const rechazar = (id) => setEstados(prev => ({ ...prev, [id]: "rechazado" }))

  async function handleVerificarIA(i) {
    setLoadingIA(prev => ({ ...prev, [i]: true }))
    try {
      const score = await verificarIA(REPORTES[i].texto)
      setScores(prev => ({ ...prev, [i]: score }))
    } catch {
      setScores(prev => ({ ...prev, [i]: -1 }))
    } finally {
      setLoadingIA(prev => ({ ...prev, [i]: false }))
    }
  }

  const guardarComentario = (id) => {
    if (!comentarios[id]?.trim()) {
      setErrores(prev => ({ ...prev, [id]: "Escribe un comentario antes de guardar" }))
      return
    }
    setGuardado(prev => ({ ...prev, [id]: true }))
    setActivo(prev => ({ ...prev, [id]: false }))
    setErrores(prev => ({ ...prev, [id]: null }))
  }

  return (
    <>
      <h2 className="text-3xl font-bold mb-6">Reportes por Firmar</h2>
      <div className="flex flex-col gap-4">
        {REPORTES.map((r, i) => {
          const score   = scores[i]
          const pct     = score !== undefined && score >= 0 ? Math.round(score * 100) : null
          const firmado = estados[i] === "firmado"

          return (
            <div key={i} className={`bg-white rounded-xl shadow p-6 border-l-4 transition-all
              ${firmado ? "border-green-400" :
                estados[i] === "rechazado" ? "border-red-400" : "border-blue-400"}`}>

              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button onClick={() => setModalIdx(i)}
                    className="w-10 h-10 rounded-full bg-[#18AD8F]/10 text-[#18AD8F] flex items-center justify-center flex-shrink-0 hover:bg-[#18AD8F]/20 transition cursor-pointer"
                    title="Ver documento">
                    <FaFileLines size={20} />
                  </button>
                  <div>
                    <p className="font-bold text-gray-800">{r.alumno}</p>
                    <p className="text-xs text-gray-400">{r.matricula} · {r.tipo} · {r.fecha}</p>
                    <button onClick={() => setModalIdx(i)}
                      className="text-xs text-[#18AD8F] hover:underline mt-0.5 flex items-center gap-1">
                      <FaEye size={10} /> Ver documento
                    </button>
                    {firmado && (
                      <p className="text-xs text-green-600 font-semibold mt-1">✓ Firmado — el alumno puede verlo</p>
                    )}
                  </div>
                </div>

                {estados[i] !== "rechazado" && !firmado ? (
                  <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
                    <button onClick={() => handleVerificarIA(i)} disabled={loadingIA[i]}
                      className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 font-semibold px-3 py-2 rounded-lg hover:bg-purple-200 transition disabled:opacity-50">
                      {loadingIA[i] ? <FaSpinner size={12} className="animate-spin" /> : <FaRobot size={12} />}
                      {loadingIA[i] ? "Verificando..." : "Verificar IA"}
                    </button>
                    <button onClick={() => setModalIdx(i)}
                      className="flex items-center gap-1 text-xs bg-green-100 text-green-700 font-semibold px-3 py-2 rounded-lg hover:bg-green-200 transition">
                      <FaCircleCheck size={12} /> Firmar
                    </button>
                    <button onClick={() => rechazar(i)}
                      className="flex items-center gap-1 text-xs bg-red-100 text-red-600 font-semibold px-3 py-2 rounded-lg hover:bg-red-200 transition">
                      <FaCircleXmark size={12} /> Rechazar
                    </button>
                    <button onClick={() => setActivo(prev => ({ ...prev, [i]: !activo[i] }))}
                      className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 font-semibold px-3 py-2 rounded-lg hover:bg-blue-200 transition">
                      <FaCommentDots size={12} /> Comentar
                    </button>
                  </div>
                ) : (
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full self-start
                    ${firmado ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {firmado ? "✓ Firmado" : "✗ Rechazado"}
                  </span>
                )}
              </div>

              {/* Resultado IA */}
              {pct !== null && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold
                      ${pct >= 60 ? "text-red-600" : pct >= 40 ? "text-yellow-600" : "text-green-600"}`}>
                      🤖 {pct >= 60 ? "Alta probabilidad de IA" : pct >= 40 ? "Incierto" : "Probablemente humano"} — {pct}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-700
                      ${pct >= 60 ? "bg-red-500" : pct >= 40 ? "bg-yellow-400" : "bg-green-500"}`}
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )}
              {scores[i] === -1 && <p className="text-red-500 text-xs mt-2">Error al verificar con IA</p>}

              {/* Comentario */}
              {activo[i] && (
                <div className="mt-3 flex flex-col gap-2">
                  <TextArea rows="2" value={comentarios[i] || ""}
                    onChange={(e) => setComentarios(prev => ({ ...prev, [i]: e.target.value }))}
                    placeholder="Escribe un comentario..." />
                  <button onClick={() => guardarComentario(i)}
                    className="self-end text-xs bg-blue-100 text-blue-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-200 transition">
                    Guardar comentario
                  </button>
                  {errores[i] && <p className="text-red-500 text-xs">{errores[i]}</p>}
                </div>
              )}
              {guardado[i] && (
                <p className="mt-2 flex items-center gap-1 text-xs text-green-600 font-semibold">
                  <FaCheck size={12} /> Comentario guardado
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Modal del documento */}
      {modalIdx !== null && (
        <ModalDocumento
          reporte={REPORTES[modalIdx]}
          firmado={estados[modalIdx] === "firmado"}
          onCerrar={() => setModalIdx(null)}
          onFirmar={() => { firmar(modalIdx); setModalIdx(null) }}
        />
      )}
    </>
  )
}

export default ReportesFirmar
