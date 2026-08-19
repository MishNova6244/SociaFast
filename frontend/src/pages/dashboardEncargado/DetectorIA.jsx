import { useState, useRef } from "react"
import { FaRobot, FaFileLines, FaTriangleExclamation, FaSpinner, FaUpload, FaXmark } from "react-icons/fa6"

const SAPLING_KEY = "EZ4DLO7CAPGBKCQ2YW5IVT484JRCNWZI"

async function extraerTexto(file) {
  const ext = file.name.split(".").pop().toLowerCase()

  if (ext === "txt") {
    return await file.text()
  }

  if (ext === "docx") {
    // Usar mammoth via CDN para extraer texto de DOCX
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const mammoth = await import("https://cdn.jsdelivr.net/npm/mammoth@1.6.0/mammoth.browser.min.js")
          const result  = await mammoth.extractRawText({ arrayBuffer: e.target.result })
          resolve(result.value)
        } catch (err) {
          reject(new Error("No se pudo leer el archivo DOCX"))
        }
      }
      reader.readAsArrayBuffer(file)
    })
  }

  if (ext === "pdf") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          // Cargar pdf.js desde CDN
          if (!window.pdfjsLib) {
            await new Promise((res, rej) => {
              const script = document.createElement("script")
              script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
              script.onload = res
              script.onerror = rej
              document.head.appendChild(script)
            })
            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
              "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"
          }
          const pdf   = await window.pdfjsLib.getDocument({ data: new Uint8Array(e.target.result) }).promise
          let texto   = ""
          for (let i = 1; i <= pdf.numPages; i++) {
            const page    = await pdf.getPage(i)
            const content = await page.getTextContent()
            texto += content.items.map(item => item.str).join(" ") + "\n"
          }
          resolve(texto)
        } catch (err) {
          reject(new Error("No se pudo leer el archivo PDF"))
        }
      }
      reader.readAsArrayBuffer(file)
    })
  }

  throw new Error("Formato no soportado")
}

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

function ResultadoBarra({ score, archivo }) {
  const pct      = Math.round(score * 100)
  const esIA     = pct >= 60
  const color    = pct >= 60 ? "bg-red-500" : pct >= 40 ? "bg-yellow-400" : "bg-green-500"
  const etiqueta = pct >= 60 ? "Probable contenido de IA" : pct >= 40 ? "Incierto" : "Probablemente humano"

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-4">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-gray-800">Resultado del análisis</h3>
        <span className={`text-xs font-bold px-3 py-1 rounded-full text-white ${esIA ? "bg-red-500" : "bg-green-500"}`}>
          {etiqueta}
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-3">{archivo}</p>
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
          Este documento tiene alta probabilidad de haber sido generado por IA.
        </p>
      )}
      {!esIA && pct < 40 && (
        <p className="text-green-600 text-sm mt-3">
          ✓ El contenido parece haber sido redactado por un humano.
        </p>
      )}
    </div>
  )
}

function DetectorIA() {
  const [archivo, setArchivo]   = useState(null)
  const [score, setScore]       = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState("")
  const [progreso, setProgreso] = useState("")
  const inputRef                = useRef()

  function handleFile(file) {
    if (!file) return
    const ext = file.name.split(".").pop().toLowerCase()
    if (!["pdf", "docx", "txt"].includes(ext)) return setError("Solo se aceptan archivos .pdf, .docx o .txt")
    setArchivo(file); setScore(null); setError("")
  }

  function limpiar() { setArchivo(null); setScore(null); setError(""); setProgreso("") }

  async function handleAnalizar() {
    if (!archivo) return setError("Selecciona un documento primero")
    setError(""); setScore(null); setLoading(true)
    try {
      setProgreso("Extrayendo texto del documento...")
      const texto = await extraerTexto(archivo)

      if (!texto.trim() || texto.trim().length < 50)
        throw new Error("El documento no tiene suficiente texto para analizar")

      setProgreso("Analizando con inteligencia artificial...")
      const resultado = await detectarIA(texto.slice(0, 5000))
      setScore(resultado)
      setProgreso("")
    } catch (err) {
      setError(err.message)
      setProgreso("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h2 className="text-3xl font-bold mb-2">Detector de IA</h2>
      <p className="text-gray-400 text-sm mb-6">
        Sube el reporte o evidencia de un alumno para verificar si fue generado por inteligencia artificial.
        Acepta PDF, DOCX y TXT.
      </p>

      <div className="bg-white rounded-xl shadow p-6">
        {!archivo ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }}
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-[#18AD8F] hover:bg-[#18AD8F]/5 transition">
            <FaUpload size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="font-semibold text-gray-600">Arrastra el documento aquí</p>
            <p className="text-sm text-gray-400 mt-1">o haz clic para seleccionar</p>
            <p className="text-xs text-gray-300 mt-2">PDF · DOCX · TXT</p>
            <input ref={inputRef} type="file" accept=".pdf,.docx,.txt" className="hidden"
              onChange={(e) => handleFile(e.target.files[0])} />
          </div>
        ) : (
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#18AD8F]/10 text-[#18AD8F] flex items-center justify-center">
                <FaFileLines size={20} />
              </div>
              <div>
                <p className="font-semibold text-gray-700">{archivo.name}</p>
                <p className="text-xs text-gray-400">{(archivo.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button onClick={limpiar} className="text-gray-400 hover:text-red-500 transition">
              <FaXmark size={18} />
            </button>
          </div>
        )}

        {error    && <p className="text-red-500 text-sm mt-3">{error}</p>}
        {progreso && <p className="text-[#18AD8F] text-sm mt-3 animate-pulse">{progreso}</p>}

        <div className="flex justify-end mt-5">
          <button onClick={handleAnalizar} disabled={!archivo || loading}
            className="flex items-center gap-2 bg-[#18AD8F] text-white font-bold px-6 py-2 rounded-full hover:bg-[#149B80] transition disabled:opacity-50">
            {loading ? <FaSpinner size={14} className="animate-spin" /> : <FaRobot size={14} />}
            {loading ? "Analizando..." : "Analizar documento"}
          </button>
        </div>
      </div>

      {score !== null && <ResultadoBarra score={score} archivo={archivo?.name} />}
    </>
  )
}

export default DetectorIA