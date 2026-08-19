import { useState } from "react"
import { FaRobot, FaUpload, FaCircleCheck } from "react-icons/fa6"
import { extraerTexto, analizarTexto } from "../../services/iaService"


function DetectorIA() {
  const [archivo, setArchivo] = useState(null)
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleAnalizar() {
    if (!archivo) return
    setLoading(true)
    try {
      const texto = await extraerTexto(archivo)
      const res = await analizarTexto(texto)
      setResultado(res)
    } catch (error) {
      console.error(error)
      setResultado({ porcentaje: 0, conclusion: "Error al procesar el archivo." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h2 className="text-3xl font-bold mb-2">Detector de IA</h2>
      <p className="text-gray-400 text-sm mb-6">Verifica si un documento fue generado con inteligencia artificial.</p>

      <div className="max-w-xl space-y-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <FaRobot size={22} className="text-purple-500" />
            <h3 className="font-semibold">Subir documento para análisis</h3>
          </div>

          <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-purple-400 transition">
            <FaUpload size={24} className="text-gray-400 mb-2" />
            <p className="text-sm text-gray-400">{archivo ? archivo.name : "Arrastra o selecciona un archivo .docx o .pdf"}</p>
            <input type="file" accept=".docx,.pdf" className="hidden"
              onChange={(e) => { setArchivo(e.target.files[0]); setResultado(null) }} />
          </label>

          <button onClick={handleAnalizar} disabled={!archivo || loading}
            className={`mt-4 w-full font-bold py-2 rounded-lg transition
              ${archivo ? "bg-purple-500 text-white hover:bg-purple-600" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
            {loading ? "Analizando..." : "Analizar documento"}
          </button>
        </div>

        {resultado && (
          <div className={`bg-white rounded-xl shadow p-6 border-l-4
            ${resultado.porcentaje < 30 ? "border-green-400" :
              resultado.porcentaje < 60 ? "border-yellow-400" : "border-red-400"}`}>
            <div className="flex items-center gap-3 mb-3">
              <FaCircleCheck size={20} className="text-green-500" />
              <h3 className="font-semibold">Resultado del análisis</h3>
            </div>
            <p className="text-4xl font-bold mb-1">{resultado.porcentaje}%
              <span className="text-base font-normal text-gray-400 ml-2">contenido IA detectado</span>
            </p>
            {/* Barra de progreso */}
            <div className="w-full bg-gray-200 rounded-full h-3 my-3">
              <div className="h-3 rounded-full transition-all duration-700"
                style={{
                  width: `${resultado.porcentaje}%`,
                  backgroundColor: resultado.porcentaje < 30 ? "#16a34a" :
                                   resultado.porcentaje < 60 ? "#f59e0b" : "#ef4444"
                }} />
            </div>
            <p className="text-sm text-gray-600">{resultado.conclusion}</p>
          </div>
        )}
      </div>
    </>
  )
}

export default DetectorIA