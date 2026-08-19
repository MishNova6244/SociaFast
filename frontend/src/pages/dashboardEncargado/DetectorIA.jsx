import { useState } from "react"
import { FaRobot, FaFileLines, FaCircleCheck, FaTriangleExclamation, FaSpinner } from "react-icons/fa6"

const SAPLING_KEY = "EZ4DLO7CAPGBKCQ2YW5IVT484JRCNWZI"

async function detectarIA(texto) {
  const res = await fetch("https://api.sapling.ai/api/v1/aidetect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: SAPLING_KEY, text: texto }),
  })
  if (!res.ok) throw new Error("Error al contactar la API de detección")
  const data = await res.json()
  return data.score // 0 = humano, 1 = IA
}

function ResultadoBarra({ score }) {
  const pct     = Math.round(score * 100)
  const esIA    = pct >= 60
  const color   = pct >= 60 ? "bg-red-500" : pct >= 40 ? "bg-yellow-400" : "bg-green-500"
  const etiqueta = pct >= 60 ? "Probable contenido de IA" : pct >= 40 ? "Incierto" : "Probablemente humano"

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-800">Resultado del análisis</h3>
        <span className={`text-xs font-bold px-3 py-1 rounded-full text-white ${esIA ? "bg-red-500" : "bg-green-500"}`}>
          {etiqueta}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
        <div className={`h-4 rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>Humano</span>
        <span className="font-bold text-gray-700">{pct}% probabilidad de IA</span>
        <span>IA</span>
      </div>
      {esIA && (
        <p className="text-red-500 text-sm mt-3 flex items-center gap-2">
          <FaTriangleExclamation size={14} />
          Este texto tiene alta probabilidad de haber sido generado por IA.
        </p>
      )}
    </div>
  )
}

function DetectorIA() {
  const [texto, setTexto]       = useState("")
  const [score, setScore]       = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState("")

  async function handleAnalizar() {
    if (!texto.trim()) return setError("Ingresa el texto a analizar")
    if (texto.trim().length < 50) return setError("El texto debe tener al menos 50 caracteres")
    setError("")
    setScore(null)
    setLoading(true)
    try {
      const resultado = await detectarIA(texto)
      setScore(resultado)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h2 className="text-3xl font-bold mb-2">Detector de IA</h2>
      <p className="text-gray-400 text-sm mb-6">
        Pega el texto de un reporte o evidencia para verificar si fue generado por inteligencia artificial.
      </p>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-2 mb-3">
          <FaFileLines size={18} className="text-[#18AD8F]" />
          <label className="font-semibold text-gray-700">Texto a analizar</label>
        </div>
        <textarea
          value={texto}
          onChange={(e) => { setTexto(e.target.value); setError("") }}
          placeholder="Pega aquí el texto del reporte o evidencia del alumno (mínimo 50 caracteres)..."
          rows={8}
          className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#18AD8F] resize-none"
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-400">{texto.length} caracteres</span>
          {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>

        <div className="flex justify-end mt-4">
          <button onClick={handleAnalizar} disabled={loading}
            className="flex items-center gap-2 bg-[#18AD8F] text-white font-bold px-6 py-2 rounded-full hover:bg-[#149B80] transition disabled:opacity-50">
            {loading ? <FaSpinner size={14} className="animate-spin" /> : <FaRobot size={14} />}
            {loading ? "Analizando..." : "Analizar texto"}
          </button>
        </div>
      </div>

      {score !== null && <ResultadoBarra score={score} />}
    </>
  )
}

export default DetectorIA
