import { useOutletContext } from "react-router-dom"
import { FaClock, FaFileLines, FaCircleCheck } from "react-icons/fa6"

const META = 48

function Home() {
  const { user } = useOutletContext() || {}
  const horas      = user?.horas_acumuladas ?? 0
  const porcentaje = Math.min(Math.round((horas / META) * 100), 100)

  return (
    <>
      <h2 className="text-3xl font-bold mb-6">Inicio</h2>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <FaClock size={20} className="text-[#18AD8F]" />
            <h3 className="text-gray-500 text-sm">Horas registradas</h3>
          </div>
          <p className="text-3xl font-bold">{horas}</p>
          <p className="text-xs text-gray-400 mt-1">de {META} hrs del cuatrimestre</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <FaFileLines size={20} className="text-[#18AD8F]" />
            <h3 className="text-gray-500 text-sm">Documentos generados</h3>
          </div>
          <p className="text-3xl font-bold">0</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-2">
            <FaCircleCheck size={20} className="text-[#18AD8F]" />
            <h3 className="text-gray-500 text-sm">Estado</h3>
          </div>
          <p className={`text-2xl font-bold ${porcentaje >= 100 ? "text-green-600" : "text-[#18AD8F]"}`}>
            {porcentaje >= 100 ? "Completado" : "En progreso"}
          </p>
        </div>
      </div>

      {/* Barra de progreso principal */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg">Progreso del cuatrimestre</h3>
          <span className="text-sm font-bold text-[#18AD8F]">{porcentaje}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden">
          <div
            className="h-5 rounded-full transition-all duration-700 flex items-center justify-end pr-2"
            style={{
              width: `${porcentaje}%`,
              backgroundColor: porcentaje >= 100 ? "#16a34a" : "#18AD8F",
              minWidth: porcentaje > 0 ? "2rem" : "0",
            }}
          >
            {porcentaje > 10 && (
              <span className="text-white text-xs font-bold">{horas}h</span>
            )}
          </div>
        </div>

        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>0 hrs</span>
          <span>{META} hrs</span>
        </div>

        {porcentaje >= 100 && (
          <p className="text-green-600 font-semibold text-sm mt-3 text-center">
            Has completado las horas del cuatrimestre
          </p>
        )}
      </div>
    </>
  )
}

export default Home