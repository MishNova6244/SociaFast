import { useState } from "react"
import { FaRobot, FaFileLines, FaTriangleExclamation, FaSpinner, FaMagnifyingGlass } from "react-icons/fa6"

const SAPLING_KEY = "EZ4DLO7CAPGBKCQ2YW5IVT484JRCNWZI"

async function detectarIA(texto) {
  const res = await fetch("https://api.sapling.ai/api/v1/aidetect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: SAPLING_KEY, text: texto }),
  })
  if (!res.ok) throw new Error("Error al contactar la API de detección")
  const data = await res.json()
  return data.score
}

function ResultadoBarra({ score }) {
  const pct      = Math.round(score * 100)
  const esIA     = pct >= 60
  const color    = pct >= 60 ? "bg-red-500" : pct >= 40 ? "bg-yellow-400" : "bg-green-500"
  const etiqueta = pct >= 60 ? "Probable IA" : pct >= 40 ? "Incierto" : "Humano"

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700">Resultado</span>
        <span className={`text-xs font-bold px-3 py-1 rounded-full text-white ${esIA ? "bg-red-500" : "bg-green-500"}`}>
          {etiqueta} — {pct}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div className={`h-3 rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      {esIA && (
        <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
          <FaTriangleExclamation size={11} /> Alta probabilidad de contenido generado por IA
        </p>
      )}
    </div>
  )
}

function DetectorIAAdmin() {
  const [texto, setTexto]     = useState("")
  const [score, setScore]     = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState("")

  async function handleAnalizar() {
    if (!texto.trim()) return setError("Ingresa el texto a analizar")
    if (texto.trim().length < 50) return setError("Mínimo 50 caracteres")
    setError(""); setScore(null); setLoading(true)
    try {
      setScore(await detectarIA(texto))
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
        Verifica si un documento o reporte fue generado por inteligencia artificial.
      </p>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center gap-2 mb-3">
          <FaMagnifyingGlass size={16} className="text-[#18AD8F]" />
          <label className="font-semibold text-gray-700">Texto a analizar</label>
        </div>
        <textarea
          value={texto}
          onChange={(e) => { setTexto(e.target.value); setError("") }}
          placeholder="Pega el contenido del documento a verificar (mínimo 50 caracteres)..."
          rows={8}
          className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#18AD8F] resize-none"
        />
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-400">{texto.length} caracteres</span>
          {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>

        {score !== null && <ResultadoBarra score={score} />}

        <div className="flex justify-end mt-4">
          <button onClick={handleAnalizar} disabled={loading}
            className="flex items-center gap-2 bg-[#1A3A5C] text-white font-bold px-6 py-2 rounded-full hover:bg-[#122840] transition disabled:opacity-50">
            {loading ? <FaSpinner size={14} className="animate-spin" /> : <FaRobot size={14} />}
            {loading ? "Analizando..." : "Analizar documento"}
          </button>
        </div>
      </div>
    </>
  )
}

export default DetectorIAAdmin
