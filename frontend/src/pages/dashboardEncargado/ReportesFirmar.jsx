import { useState } from "react"
import { FaFileLines, FaCircleCheck, FaCircleXmark, FaRobot, FaCommentDots, FaCheck } from "react-icons/fa6"
import TextArea from "../../components/TextArea"

const REPORTES = [
  { alumno: "Ana García López",   matricula: "25310201", fecha: "28 Jul 2026", tipo: "Reporte Final" },
  { alumno: "Diana Torres Pérez", matricula: "25310203", fecha: "30 Jul 2026", tipo: "Reporte Final" },
]

function ReportesFirmar() {
  const [estados, setEstados] = useState({})
  const [comentarios, setComentarios] = useState({})
  const [activo, setActivo] = useState({})
  const [guardado, setGuardado] = useState({})
  const [errores, setErrores] = useState({})

  const firmar = (id, status) => setEstados(prev => ({ ...prev, [id]: status }))
  const agregarComentario = (id, texto) => {
  setComentarios(prev => ({ ...prev, [id]: texto }))
  }

  const guardarComentario = (id) => {
    if (!comentarios[id] || comentarios[id].trim() === "") {
      // Si está vacío, mostrar el error
      setErrores(prev => ({ ...prev, [id]: "Es necesario escribir un comentario antes de guardar" }))
      return
    }
    // Si hay texto, guardar y cerrar
    setGuardado(prev => ({ ...prev, [id]: true }))
    setActivo(prev => ({ ...prev, [id]: false }))
    setErrores(prev => ({ ...prev, [id]: null })) // limpiar error
  } 

  return (
    <>
      <h2 className="text-3xl font-bold mb-6">Reportes por Firmar</h2>
      <div className="flex flex-col gap-4">
        {REPORTES.map((r, i) => (
          <div key={i} className={`bg-white rounded-xl shadow p-6 border-l-4 transition-all
            ${estados[i] === "firmado" ? "border-green-400" :
              estados[i] === "rechazado" ? "border-red-400" : "border-blue-400"}`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#18AD8F]/10 text-[#18AD8F] flex items-center justify-center flex-shrink-0">
                  <FaFileLines size={20} />
                </div>
                <div>
                  <p className="font-bold text-gray-800">{r.alumno}</p>
                  <p className="text-xs text-gray-400">Matrícula: {r.matricula} · {r.tipo} · {r.fecha}</p>
                </div>
              </div>
              {!estados[i] ? (
                <div className="grid grid-cols-2 w-full gap-2 sm:flex sm:flex-wrap sm:justify-end">
                  <button onClick={() => firmar(i, "ia_pendiente")}
                    className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 font-semibold px-3 py-2 rounded-lg hover:bg-purple-200 transition">
                    <FaRobot size={12} /> Verificar IA
                  </button>
                  <button onClick={() => firmar(i, "firmado")}
                    className="flex items-center gap-1 text-xs bg-green-100 text-green-700 font-semibold px-3 py-2 rounded-lg hover:bg-green-200 transition">
                    <FaCircleCheck size={12} /> Firmar
                  </button>
                  <button onClick={() => firmar(i, "rechazado")}
                    className="flex items-center gap-1 text-xs bg-red-100 text-red-600 font-semibold px-3 py-2 rounded-lg hover:bg-red-200 transition">
                    <FaCircleXmark size={12} /> Rechazar
                  </button>
                  <button
                    onClick={() => setActivo(prev => ({ ...prev, [i]: true }))}
                    className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 font-semibold px-3 py-2 rounded-lg hover:bg-blue-200 transition">
                    <FaCommentDots size={12} /> Comentar
                  </button>
                </div>
              ) : (
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full
                  ${estados[i] === "firmado" ? "bg-green-100 text-green-700" :
                    estados[i] === "rechazado" ? "bg-red-100 text-red-600" :
                    "bg-purple-100 text-purple-700"}`}>
                  {estados[i] === "firmado" ? "✓ Firmado" :
                   estados[i] === "rechazado" ? "✗ Rechazado" : "⏳ Verificando IA..."}
                </span>
              )}
            </div>
            {/* TextArea para agregar comentario */}
            {activo[i] && (
              <div className="mt-3 flex flex-col gap-2">
                <TextArea
                  rows="2"
                  value={comentarios[i] || ""}
                  onChange={(e) => agregarComentario(i, e.target.value)}
                  placeholder="Escribe un comentario..."
                  className="w-full text-sm border border-[#18AD8F] rounded-lg p-2"
                />
                <button
                  onClick={() => guardarComentario(i)}
                  className="self-end text-xs bg-blue-100 text-blue-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-200 transition">
                  Guardar comentario
                </button>
                {errores[i] && (
                  <p className="text-red-500 text-sm mt-2 mb-4">{errores[i]}</p>
                )}  
              </div>
            )}

            {/* Mensaje de confirmación */}
            {guardado[i] && (
              <p className="mt-2 flex items-center gap-1 text-xs text-green-600 font-semibold">
                <FaCheck size={12} /> Comentario guardado
              </p>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

export default ReportesFirmar
