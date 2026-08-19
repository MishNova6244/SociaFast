import { useState } from "react"
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6"
import ModalFormularioDesempeno from "../../components/ModalFormularioDesempeno"

const HISTORIAL = [
  { alumno: "Leslie Margarita Aranda",  matricula: "25310157", carrera: "Infraestructura en Redes Digitales", etapa: "Horas",      estado: "aprobado",  fecha: "20 Jul 2026", comentario: "48 horas completas verificadas." },
  { alumno: "Nahomi Torres Escobar",    matricula: "25310206", carrera: "Infraestructura en Redes Digitales", etapa: "Evidencias", estado: "aprobado",  fecha: "22 Jul 2026", comentario: "Documentos en orden." },
  { alumno: "Luz Aracely Muñoz Perez",  matricula: "25310130", carrera: "Ing. Industrial",                   etapa: "Horas",      estado: "en_proceso", fecha: "21 Jul 2026", comentario: "" },
]

function HistorialAprobaciones() {
  const [alumnoEvaluar, setAlumnoEvaluar] = useState(null)

  return (
    <>
      <h2 className="text-3xl font-bold mb-6">Historial de Aprobaciones</h2>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="overflow-x-auto w-full max-w-full">
          <table className="min-w-[700px] w-full text-xs sm:text-sm md:text-base">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-gray-400 font-medium pb-3">Alumno</th>
                <th className="text-left text-gray-400 font-medium pb-3">Etapa</th>
                <th className="text-center text-gray-400 font-medium pb-3">Estado</th>
                <th className="text-left text-gray-400 font-medium pb-3">Fecha</th>
                <th className="text-left text-gray-400 font-medium pb-3">Comentario</th>
                <th className="text-left text-gray-400 font-medium pb-3">Evaluar desempeño</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {HISTORIAL.map((h, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="py-3 font-semibold text-gray-700">{h.alumno}</td>
                  <td className="py-3 text-gray-500">{h.etapa}</td>
                  <td className="py-3">
                    <div className="flex justify-center">
                      {h.estado === "aprobado"
                        ? <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full"><FaCircleCheck size={11} /> Aprobado</span>
                        : <span className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full"><FaCircleXmark size={11} /> Rechazado</span>
                      }
                    </div>
                  </td>
                  <td className="py-3 text-gray-400">{h.fecha}</td>
                  <td className="py-3 text-gray-400 italic">{h.comentario || "—"}</td>
                  <td className="py-3 text-gray-400 text-left sm:px-6">
                    <button
                      onClick={() => setAlumnoEvaluar({ nombre: h.alumno, matricula: h.matricula, carrera: h.carrera })}
                      className="text-xs bg-[#18AD8F] text-white px-3 py-1.5 rounded-lg hover:bg-[#149B80] transition">
                      Evaluar alumno
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ModalFormularioDesempeno
        alumno={alumnoEvaluar}
        onClose={() => setAlumnoEvaluar(null)}
        onGuardado={(datos) => console.log("Evaluación guardada:", datos)}
      />
    </>
  )
}

export default HistorialAprobaciones