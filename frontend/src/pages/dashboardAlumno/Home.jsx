import { useOutletContext, useNavigate } from "react-router-dom"
import { FaClock, FaFileLines, FaFileArrowUp, FaCircleCheck, FaCircle, FaLocationDot, FaCalendarDays, FaCheck, FaUserTie, FaBuilding, FaTriangleExclamation } from "react-icons/fa6"

const MAX_HOURS = 48

// Componente de etapa individual del progreso
function StageItem({ icon, title, description, status }) {
  const isApproved = status === "approved"
  const isCompleted = status === "completed" || isApproved
  return (
    <div className = {`flex items-center gap-4 p-4 rounded-xl border transition-all
      ${isApproved ? "bg-green-50 border-green-200" : isCompleted ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"}`}>
      <div className = {`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg
        ${isApproved ? "bg-green-100 text-green-600" : isCompleted ? "bg-blue-100 text-blue-500" : "bg-gray-200 text-gray-400"}`}>
        {icon}
      </div>
      <div className = "flex-1">
        <p className = {`font-semibold text-sm ${isApproved ? "text-green-700" : isCompleted ? "text-blue-700" : "text-gray-500"}`}>
          {title}
        </p>
        <p className = "text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
      <div className = "flex-shrink-0">
        {isApproved && <FaCircleCheck size = {22} className = "text-green-500" />}
        {isCompleted && !isApproved && (
          <span className = "text-xs bg-blue-100 text-blue-600 font-semibold px-2 py-1 rounded-full"> En revisión </span>
        )}
        {!isCompleted && <FaCircle size={22} className = "text-gray-300" />}
      </div>
    </div>
  )
}

function Home() {
  const { user } = useOutletContext() || {}
  const navigate = useNavigate()
  const hours = user?.accumulated_hours ?? 0
  const percentage = Math.min(Math.round((hours / MAX_HOURS) * 100), 100)

  const perfilIncompleto = !user?.grupo || !user?.genero

  const stages = [
    { icon: <FaClock size={18} />, title: "Registro de horas", description: `${hours} de ${MAX_HOURS} horas registradas`,
      status: hours >= MAX_HOURS ? "approved" : hours > 0 ? "completed" : "pending" },
    { icon: <FaFileArrowUp size={18} />, title: "Subida de evidencias",  description: "Documentos de respaldo del servicio social", status: "pending" },
    { icon: <FaFileLines size={18} />, title: "Generación de reporte", description: "Reporte final del servicio social", status: "pending" },
    { icon: <FaCheck size={18} />, title: "Aprobación final", description: "Validación por parte del encargado", status: "pending" },
  ]

  return (
    <>
      <h2 className = "text-3xl font-bold mb-6"> Inicio </h2>

      {perfilIncompleto && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
          <div className="flex items-start sm:items-center gap-3">
            <FaTriangleExclamation className="text-yellow-500 shrink-0 mt-0.5 sm:mt-0" size={20} />
            <p className="text-sm text-yellow-800">
              ¡Aviso! Favor de completar la información de grupo y género en tu perfil.
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboardAlumno/perfil")}
            className="text-sm bg-yellow-500 text-white font-semibold px-4 py-1.5 rounded-lg hover:bg-yellow-600 transition shrink-0"
          >
            Completar perfil
          </button>
        </div>
      )}

      {/* Tarjetas resumen */}
      <div className = "grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className = "bg-white rounded-xl shadow p-6">
          <div className = "flex items-center gap-3 mb-2">
            <FaClock size = {20} className = "text-[#18AD8F]" />
            <h3 className = "text-gray-500 text-sm"> Horas registradas </h3>
          </div>
          <p className = "text-3xl font-bold">{hours}</p>
          <p className = "text-xs text-gray-400 mt-1">de {MAX_HOURS} hrs del cuatrimestre</p>
        </div>
        <div className = "bg-white rounded-xl shadow p-6">
          <div className = "flex items-center gap-3 mb-2">
            <FaFileLines size = {20} className = "text-[#18AD8F]" />
            <h3 className = "text-gray-500 text-sm"> Documentos generados </h3>
          </div>
          <p className = "text-3xl font-bold">0</p>
        </div>
        <div className = "bg-white rounded-xl shadow p-6">
          <div className = "flex items-center gap-3 mb-2">
            <FaCircleCheck size = {20} className = "text-[#18AD8F]" />
            <h3 className = "text-gray-500 text-sm"> Estado </h3>
          </div>
          <p className = {`text-2xl font-bold ${percentage >= 100 ? "text-green-600" : "text-[#18AD8F]"}`}>
            {percentage >= 100 ? "Completado" : "En progreso"}
          </p>
        </div>
      </div>

      <div className = "grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Barra de progreso */}
        <div className = "lg:col-span-2 bg-white rounded-xl shadow p-6">
          <div className = "flex justify-between items-center mb-4">
            <h3 className = "font-semibold text-lg"> Progreso del cuatrimestre </h3>
            <span className = "text-lg font-bold text-[#18AD8F]">{percentage}%</span>
          </div>
          <div className = "w-full bg-gray-200 rounded-full h-8 overflow-hidden">
            <div className = "h-8 rounded-full transition-all duration-700 flex items-center justify-end pr-3"
              style = {{ width: `${percentage}%`, backgroundColor: percentage >= 100 ? "#16a34a" : "#18AD8F", minWidth: percentage > 0 ? "3rem" : "0" }}>
              {percentage > 8 && <span className = "text-white text-sm font-bold">{hours}h</span>}
            </div>
          </div>
          <div className = "flex justify-between text-sm text-gray-400 mt-2">
            <span>0 hrs</span><span>{MAX_HOURS} hrs</span>
          </div>
          {percentage >= 100 && (
            <p className = "text-green-600 font-semibold text-sm mt-3 text-center"> Has completado las horas del cuatrimestre </p>
          )}
        </div>

        {/* Detectar entre actividades extracurriculares o programas */}
        <div className = "bg-white rounded-xl shadow p-6">
          <div className = "flex items-center gap-2 mb-3">
            <FaCalendarDays size = {18} className = "text-[#18AD8F]" />
            <h3 className = "font-semibold"> Actividad extracurricular </h3>
          </div>
          {user?.actividad ? (
            <div>
              <p className="font-bold text-gray-800 mb-1">
                {user.actividad}
              </p>
              {user.actividad_lugar ? (
                <>
                  {/* Deportes / Culturales */}
                  <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                    <FaLocationDot size={11} className="text-[#18AD8F]" />
                    {user.actividad_lugar}
                  </p>
                  {user.actividad_horarios?.map((h, i) => (
                    <p key={i} className="text-xs text-gray-500 flex items-center gap-1">
                      <FaClock size={10} className="text-[#18AD8F]" />
                      <strong>{h.dia}:</strong> {h.hora}
                    </p>
                  ))}
                </>
              ) : (
                <>
                  {/* Programas */}
                  <p className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                    <FaUserTie size={11} className="text-[#18AD8F]" />
                    {user.actividad_encargado}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <FaBuilding size={11} className="text-[#18AD8F]" />
                    {user.actividad_departamento}
                  </p>
                </>
              )}
              <button
                onClick={() => navigate("/dashboardAlumno/actividades")}
                className="mt-3 text-xs text-[#18AD8F] font-semibold hover:underline">
                Cambiar actividad
              </button>
            </div>
          ) : (
            <div className = "flex flex-col items-center justify-center h-24 gap-2">
              <p className = "text-sm text-gray-400 text-center"> Sin actividad registrada </p>
              <button onClick = {() => navigate("/dashboardAlumno/actividades")}
                className = "text-xs bg-[#18AD8F] text-white px-3 py-1.5 rounded-full hover:bg-[#149B80] transition">
                Seleccionar actividad
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Etapas del progreso */}
      <div className = "bg-white rounded-xl shadow p-6">
        <h3 className = "font-semibold text-lg mb-4"> Etapas del progreso </h3>
        <div className = "flex flex-col gap-3">
          {stages.map((stage, i) => (
            <div key={i} className = "relative">
              {i < stages.length - 1 && (
                <div className = {`absolute left-9 top-14 w-0.5 h-3 z-10
                  ${stage.status !== "pending" ? "bg-[#18AD8F]" : "bg-gray-300"}`} />
              )}
              <StageItem {...stage} />
            </div>
          ))}
        </div>
        <p className = "text-xs text-gray-400 mt-4"> La palomita verde aparece cuando el encargado valide cada etapa. </p>
      </div>
    </>
  )
}

export default Home