import { useOutletContext } from "react-router-dom"
import { FaClock, FaFileLines, FaCircleCheck, FaCircleXmark, FaCircle } from "react-icons/fa6"

const META = 48

// Estado de cada etapa: "pendiente" | "completado" | "aprobado"
function EtapaItem({ icono, titulo, descripcion, estado }) {
  const esAprobado   = estado === "aprobado"
  const esCompletado = estado === "completado" || esAprobado
  const esPendiente  = estado === "pendiente"

  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all
      ${esAprobado   ? "bg-green-50 border-green-200" :
        esCompletado ? "bg-blue-50 border-blue-200"   :
                       "bg-gray-50 border-gray-200"}`}>

      {/* Icono de la etapa */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg
        ${esAprobado   ? "bg-green-100 text-green-600" :
          esCompletado ? "bg-blue-100 text-blue-500"   :
                         "bg-gray-200 text-gray-400"}`}>
        {icono}
      </div>

      {/* Texto */}
      <div className="flex-1">
        <p className={`font-semibold text-sm
          ${esAprobado ? "text-green-700" : esCompletado ? "text-blue-700" : "text-gray-500"}`}>
          {titulo}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{descripcion}</p>
      </div>

      {/* Indicador de estado */}
      <div className="flex-shrink-0">
        {esAprobado   && <FaCircleCheck size={22} className="text-green-500" />}
        {esCompletado && !esAprobado && (
          <span className="text-xs bg-blue-100 text-blue-600 font-semibold px-2 py-1 rounded-full">
            En revisión
          </span>
        )}
        {esPendiente  && <FaCircle size={22} className="text-gray-300" />}
      </div>
    </div>
  )
}

function Home() {
  const { user } = useOutletContext() || {}
  const horas      = user?.horas_acumuladas ?? 0
  const porcentaje = Math.min(Math.round((horas / META) * 100), 100)

  // Estado de las etapas — se conectará al backend cuando el encargado valide
  // Por ahora: si tiene horas > 0 la primera está "completado", el resto "pendiente"
  const etapas = [
    {
      icono: <FaClock size={18} />,
      titulo: "Registro de horas",
      descripcion: `${horas} de ${META} horas registradas`,
      estado: horas >= META ? "aprobado" : horas > 0 ? "completado" : "pendiente",
    },
    {
      icono: <FaFileLines size={18} />,
      titulo: "Subida de evidencias",
      descripcion: "Documentos de respaldo del servicio social",
      estado: "pendiente",  // se actualizará cuando el módulo esté listo
    },
    {
      icono: "📄",
      titulo: "Generación de reporte",
      descripcion: "Reporte final del servicio social",
      estado: "pendiente",
    },
    {
      icono: "✅",
      titulo: "Aprobación final",
      descripcion: "Validación por parte del encargado asignado",
      estado: "pendiente",
    },
  ]

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

      {/* Barra de progreso grande */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Progreso del cuatrimestre</h3>
          <span className="text-lg font-bold text-[#18AD8F]">{porcentaje}%</span>
        </div>

        {/* Barra más grande */}
        <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
          <div
            className="h-8 rounded-full transition-all duration-700 flex items-center justify-end pr-3"
            style={{
              width: `${porcentaje}%`,
              backgroundColor: porcentaje >= 100 ? "#16a34a" : "#18AD8F",
              minWidth: porcentaje > 0 ? "3rem" : "0",
            }}
          >
            {porcentaje > 8 && (
              <span className="text-white text-sm font-bold">{horas}h</span>
            )}
          </div>
        </div>

        <div className="flex justify-between text-sm text-gray-400 mt-2">
          <span>0 hrs</span>
          <span>{META} hrs</span>
        </div>

        {porcentaje >= 100 && (
          <p className="text-green-600 font-semibold text-sm mt-3 text-center">
            Has completado las horas del cuatrimestre
          </p>
        )}
      </div>

      {/* Etapas del progreso */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-semibold text-lg mb-4">Etapas del progreso</h3>

        {/* Línea de progreso entre etapas */}
        <div className="relative">
          <div className="flex flex-col gap-3">
            {etapas.map((etapa, i) => (
              <div key={i} className="relative">
                {/* Línea conectora vertical */}
                {i < etapas.length - 1 && (
                  <div className={`absolute left-9 top-14 w-0.5 h-3 z-10
                    ${etapas[i].estado !== "pendiente" ? "bg-[#18AD8F]" : "bg-gray-300"}`}
                  />
                )}
                <EtapaItem {...etapa} />
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          La palomita verde aparece cuando el encargado valide cada etapa.
        </p>
      </div>
    </>
  )
}

export default Home