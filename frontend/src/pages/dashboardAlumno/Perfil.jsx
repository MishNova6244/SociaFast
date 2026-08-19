import { useState } from "react"
import { useOutletContext, useNavigate } from "react-router-dom"
import { FaUser, FaEnvelope, FaIdCard, FaCalendarDays, FaClock, FaLocationDot, FaPen, FaCheck, FaXmark, FaVenusMars, FaUsers, FaUserTie, FaBuilding } from "react-icons/fa6"

const MAX_HOURS = 48

function Perfil() {
  const { user: userFromContext } = useOutletContext() || {}
  const navigate = useNavigate()

  const [user, setUser] = useState(userFromContext || {})
  const [editandoDatos, setEditandoDatos] = useState(false)
  const [grupoEdit, setGrupoEdit] = useState(user.grupo || "")
  const [generoEdit, setGeneroEdit] = useState(user.genero || "")
  const [guardandoDatos, setGuardandoDatos] = useState(false)
  const [errorDatos, setErrorDatos] = useState("")

  const [confirmarDatos, setConfirmarDatos] = useState(false)

  const hours = user?.accumulated_hours ?? 0
  const percentage = Math.min(Math.round((hours / MAX_HOURS) * 100), 100)

  const getInitials = (name = "") =>
    name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()

  const iniciarEdicionDatos = () => {
    setGrupoEdit(user.grupo || "")
    setGeneroEdit(user.genero || "")
    setEditandoDatos(true)
    setErrorDatos("")
  }

  const cancelarDatos = () => {
    setEditandoDatos(false)
    setErrorDatos("")
  }

  const guardarDatos = () => {
  if (!grupoEdit.trim()) {
    return setErrorDatos("El grupo es obligatorio")
  }

  if (!generoEdit) {
    return setErrorDatos("Selecciona un género")
  }

  setErrorDatos("")
  setConfirmarDatos(true)
  }

  const confirmarGuardado = async () => {
  setGuardandoDatos(true)
  setErrorDatos("")

  try {
    const actualizado = {
      ...user,
      grupo: grupoEdit,
      genero: generoEdit,
    }

    setUser(actualizado)

    const stored = JSON.parse(localStorage.getItem("user") || "null")

    if (stored) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...stored,
          grupo: grupoEdit,
          genero: generoEdit,
        })
      )
    }

    setEditandoDatos(false)
    setConfirmarDatos(false)

  } catch (err) {
    setErrorDatos(err.message || "No se pudo actualizar la información")
  } finally {
    setGuardandoDatos(false)
  }
}

  return (
    <>
      <h2 className="text-3xl font-bold mb-6"> Perfil </h2>

      <div className="flex justify-center">
        <div className="w-full max-w-xl bg-white rounded-xl shadow p-8">

          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full bg-[#18AD8F] text-white flex items-center justify-center text-3xl font-bold mb-3">
              {getInitials(user?.full_name)}
            </div>
            <h3 className="text-xl font-bold uppercase text-center">{user?.full_name ?? "..."}</h3>
            <span className="text-sm text-white bg-[#18AD8F] px-3 py-1 rounded-full mt-2 capitalize">
              {user?.role ?? "estudiante"}
            </span>
          </div>

          <div className="divide-y divide-gray-100">

            <div className="flex items-center gap-4 py-4">
              <div className="w-10 h-10 rounded-full bg-[#18AD8F]/10 text-[#18AD8F] flex items-center justify-center flex-shrink-0">
                <FaUser size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400"> Nombre completo </p>
                <p className="font-semibold">{user?.full_name ?? "—"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-4">
              <div className="w-10 h-10 rounded-full bg-[#18AD8F]/10 text-[#18AD8F] flex items-center justify-center flex-shrink-0">
                <FaEnvelope size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400"> Correo institucional </p>
                <p className="font-semibold">{user?.email ?? "—"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-4">
              <div className="w-10 h-10 rounded-full bg-[#18AD8F]/10 text-[#18AD8F] flex items-center justify-center flex-shrink-0">
                <FaIdCard size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400"> Matrícula </p>
                <p className="font-semibold">{user?.student_id ?? "—"}</p>
              </div>
            </div>

            {/* Grupo y Género editables */}
            {/* Grupo */}
            <div className="flex items-center gap-4 py-4">
              <div className="w-10 h-10 rounded-full bg-[#18AD8F]/10 text-[#18AD8F] flex items-center justify-center flex-shrink-0">
                <FaUsers size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400">Grupo</p>
                {!editandoDatos ? (
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{user?.grupo ?? "Sin registrar"}</p>
                    {/* Mostrar lápiz de edición si aún no hay datos capturados */}
                    {!user?.grupo && (
                      <button onClick={iniciarEdicionDatos} className="text-gray-400 hover:text-[#18AD8F] transition">
                        <FaPen size={12} />
                      </button>
                    )}  
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="Ej. TRM31"
                    value={grupoEdit}
                    onChange={(e) => setGrupoEdit(e.target.value.toUpperCase())}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#18AD8F] mt-1"
                  />
                )}
              </div>
            </div>

            {/* Género */}
            <div className="flex items-center gap-4 py-4">
              <div className="w-10 h-10 rounded-full bg-[#18AD8F]/10 text-[#18AD8F] flex items-center justify-center flex-shrink-0">
                <FaVenusMars size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400">Género</p>
                {!editandoDatos ? (
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">
                      {user?.genero === "F" ? "Femenino" : user?.genero === "M" ? "Masculino" : "Sin registrar"}
                    </p>
                    {!user?.genero && (
                      <button onClick={iniciarEdicionDatos} className="text-gray-400 hover:text-[#18AD8F] transition">
                        <FaPen size={12} />
                      </button>
                    )}  
                  </div>
                ) : (
                  <>
                    <select
                      value={generoEdit}
                      onChange={(e) => setGeneroEdit(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#18AD8F] mt-1"
                    >
                      <option value="" disabled>Selecciona tu género</option>
                      <option value="F">Femenino</option>
                      <option value="M">Masculino</option>
                    </select>

                    <div className="flex justify-end gap-2 pt-2">
                      <button onClick={cancelarDatos} disabled={guardandoDatos}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 disabled:opacity-50">
                        <FaXmark size={12} /> Cancelar
                      </button>
                      <button onClick={guardarDatos} disabled={guardandoDatos}
                        className="flex items-center gap-1 text-xs bg-[#18AD8F] text-white px-3 py-1.5 rounded-lg hover:bg-[#149B80] transition disabled:opacity-50">
                        <FaCheck size={12} /> {guardandoDatos ? "Guardando..." : "Guardar"}
                      </button>
                    </div>

                    {errorDatos && <p className="text-red-500 text-xs mt-1">{errorDatos}</p>}
                  </>
                )}
              </div>
            </div>

            {/* Actividad extracurricular */}
            <div className="flex items-start gap-4 py-4">
              <div className="w-10 h-10 rounded-full bg-[#18AD8F]/10 text-[#18AD8F] flex items-center justify-center flex-shrink-0 mt-0.5">
                <FaCalendarDays size={18} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400"> Actividad Extracurricular </p>
                {user?.actividad ? (
                  <>
                  <p className="font-semibold">{user.actividad}</p>
                    {user.actividad_lugar ? (
                  <>
                  {/* Deportes / Culturales */}
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <FaLocationDot size={10} className="text-[#18AD8F]" />
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
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <FaUserTie size={10} className="text-[#18AD8F]" />
                        {user.actividad_encargado}
                      </p>

                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <FaBuilding size={10} className="text-[#18AD8F]" />
                        {user.actividad_departamento}
                      </p>
                    </>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-400 italic"> Sin actividad registrada </p>
                    <button onClick={() => navigate("/dashboardAlumno/actividades")}
                      className="text-xs text-[#18AD8F] font-semibold hover:underline">
                      Seleccionar
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 py-4">
              <div className="w-10 h-10 rounded-full bg-[#18AD8F]/10 text-[#18AD8F] flex items-center justify-center flex-shrink-0">
                <FaClock size={18} />
              </div>
              <div className="w-full">
                <p className="text-xs text-gray-400"> Horas acumuladas </p>
                <p className="font-semibold mb-2">{hours} / {MAX_HOURS} hrs</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%`, backgroundColor: percentage >= 100 ? "#16a34a" : "#18AD8F" }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{percentage}% completado</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {confirmarDatos && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Guardar datos
            </h3>
            <div className="text-gray-500 mb-6">
              <p>¿Seguro que deseas guardar los siguientes datos?</p>
              <div className="mt-3 space-y-1">
                <p>
                  Grupo: <strong>{grupoEdit}</strong>
                </p>
                <p>
                  Género:{" "}
                  <strong>
                    {generoEdit === "F" ? "Femenino" : "Masculino"}
                  </strong>
                </p>
              </div>
              <p className="mt-3">
                Ten en cuenta que esta información no podrá ser modificada
                más tarde a menos que contactes con un administrador.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setConfirmarDatos(false)}
                disabled={guardandoDatos}
                className="flex-1 border border-gray-300 text-gray-600 font-semibold py-2 rounded-lg hover:bg-gray-100 transition disabled:opacity-50">
                Cancelar
              </button>
              <button
                onClick={confirmarGuardado}
                disabled={guardandoDatos}
                className="flex-1 bg-[#18AD8F] text-white font-semibold py-2 rounded-lg hover:bg-[#149B80] transition disabled:opacity-50">
                {guardandoDatos ? "Guardando..." : "Aceptar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Perfil