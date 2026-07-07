import { useOutletContext } from "react-router-dom"
import { FaUser, FaEnvelope, FaIdCard, FaCalendarDays, FaClock } from "react-icons/fa6"

const META = 48

function Perfil() {
  const { user } = useOutletContext() || {}
  const horas      = user?.horas_acumuladas ?? 0
  const porcentaje = Math.min(Math.round((horas / META) * 100), 100)

  function getInitials(nombre = "") {
    return nombre.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
  }

  return (
    <>
      <h2 className="text-3xl font-bold mb-6">Perfil</h2>

      <div className="flex justify-center">
        <div className="w-full max-w-xl bg-white rounded-xl shadow p-8">

          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full bg-[#18AD8F] text-white flex items-center justify-center text-3xl font-bold mb-3">
              {getInitials(user?.nombre)}
            </div>
            <h3 className="text-xl font-bold uppercase text-center">{user?.nombre ?? "..."}</h3>
            <span className="text-sm text-white bg-[#18AD8F] px-3 py-1 rounded-full mt-2 capitalize">
              {user?.rol ?? "estudiante"}
            </span>
          </div>

          <div className="divide-y divide-gray-100">

            <div className="flex items-center gap-4 py-4">
              <div className="w-10 h-10 rounded-full bg-[#18AD8F]/10 text-[#18AD8F] flex items-center justify-center flex-shrink-0">
                <FaUser size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Nombre completo</p>
                <p className="font-semibold">{user?.nombre ?? "—"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-4">
              <div className="w-10 h-10 rounded-full bg-[#18AD8F]/10 text-[#18AD8F] flex items-center justify-center flex-shrink-0">
                <FaEnvelope size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Correo institucional</p>
                <p className="font-semibold">{user?.correo ?? "—"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-4">
              <div className="w-10 h-10 rounded-full bg-[#18AD8F]/10 text-[#18AD8F] flex items-center justify-center flex-shrink-0">
                <FaIdCard size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Matricula</p>
                <p className="font-semibold">{user?.matricula ?? "—"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-4">
              <div className="w-10 h-10 rounded-full bg-[#18AD8F]/10 text-[#18AD8F] flex items-center justify-center flex-shrink-0">
                <FaCalendarDays size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Actividad Extracurricular</p>
                <p className="font-semibold text-gray-400 italic">Sin actividad registrada</p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-4">
              <div className="w-10 h-10 rounded-full bg-[#18AD8F]/10 text-[#18AD8F] flex items-center justify-center flex-shrink-0">
                <FaClock size={18} />
              </div>
              <div className="w-full">
                <p className="text-xs text-gray-400">Horas acumuladas</p>
                <p className="font-semibold mb-2">{horas} / {META} hrs</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${porcentaje}%`,
                      backgroundColor: porcentaje >= 100 ? "#16a34a" : "#18AD8F",
                    }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{porcentaje}% completado</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default Perfil