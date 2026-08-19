import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { FaLocationDot, FaClock, FaCircleCheck, FaUserTie, FaBuilding } from "react-icons/fa6"
import { actividadesApi } from "../../services/api"

function TarjetaActividad({ actividad, seleccionada, onSeleccionar }) {
  const activa = seleccionada?.id === actividad.id
  return (
    <div onClick={() => onSeleccionar(actividad)}
      className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-200
        ${activa ? "border-[#18AD8F] bg-[#18AD8F]/5 shadow-md" : "border-gray-200 bg-white hover:border-[#18AD8F]/50 hover:shadow"}`}>
      <div className="flex justify-between items-start mb-3">
        <h4 className={`font-bold text-base ${activa ? "text-[#18AD8F]" : "text-gray-800"}`}>{actividad.nombre}</h4>
        {activa && <FaCircleCheck size={18} className="text-[#18AD8F] flex-shrink-0" />}
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
        <FaLocationDot size={12} className="text-[#18AD8F] flex-shrink-0" />
        <span>{actividad.lugar}</span>
      </div>
      {actividad.horarios?.map((h, i) => (
        <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
          <FaClock size={11} className="text-[#18AD8F] flex-shrink-0" />
          <span><strong>{h.dia}:</strong> {h.hora}</span>
        </div>
      ))}
    </div>
  )
}

function TarjetaPrograma({ programa, seleccionada, onSeleccionar }) {
  const activa = seleccionada?.id === programa.id
  return (
    <div onClick={() => onSeleccionar(programa)}
      className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-200
        ${activa ? "border-[#18AD8F] bg-[#18AD8F]/5 shadow-md" : "border-gray-200 bg-white hover:border-[#18AD8F]/50 hover:shadow"}`}>
      <div className="flex justify-between items-start mb-3">
        <h4 className={`font-bold text-base ${activa ? "text-[#18AD8F]" : "text-gray-800"}`}>{programa.nombre}</h4>
        {activa && <FaCircleCheck size={18} className="text-[#18AD8F] flex-shrink-0" />}
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1.5">
        <FaUserTie size={12} className="text-[#18AD8F] flex-shrink-0" />
        <span>{programa.encargado}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <FaBuilding size={12} className="text-[#18AD8F] flex-shrink-0" />
        <span>{programa.departamento}</span>
      </div>
    </div>
  )
}

function Actividades() {
  const { setUser } = useOutletContext() || {}
  const [actividades, setActividades]   = useState([])
  const [seleccionada, setSeleccionada] = useState(null)
  const [tab, setTab]                   = useState("deportes")
  const [loading, setLoading]           = useState(true)
  const [guardando, setGuardando]       = useState(false)
  const [error, setError]               = useState("")
  const [guardado, setGuardado]         = useState(false)

  // Cargar actividades del backend
  useEffect(() => {
    actividadesApi.getAll()
      .then(data => {
        setActividades(data)
        // Si el alumno ya tiene inscripción previa, preseleccionarla
        actividadesApi.getMyEnrollment()
          .then(res => {
            if (res.actividad) {
              setSeleccionada(res.actividad)
              setGuardado(true)
            }
          })
          .catch(() => {})
      })
      .catch(() => setError("No se pudieron cargar las actividades"))
      .finally(() => setLoading(false))
  }, [])

  function handleSeleccionar(actividad) {
    setSeleccionada(actividad)
    setGuardado(false)
    setError("")
  }

  async function handleGuardar() {
    if (!seleccionada) return
    setGuardando(true)
    setError("")
    try {
      await actividadesApi.enroll(seleccionada.id, "Ene-Abr 2026")
      setGuardado(true)
      // Actualizar el contexto del usuario
      setUser(prev => ({ ...prev, actividad: seleccionada.nombre }))
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  const deportes   = actividades.filter(a => a.tipo === "deporte")
  const culturales = actividades.filter(a => a.tipo === "cultural")
  const programas  = actividades.filter(a => a.tipo === "programa")

  const lista = tab === "deportes" ? deportes : tab === "cultural" ? culturales : programas

  const TABS = [
    { key: "deportes",  label: "Deportes" },
    { key: "cultural",  label: "Cultural" },
    { key: "programas", label: "Programas" },
  ]

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-400">Cargando actividades...</p>
    </div>
  )

  return (
    <>
      <h2 className="text-3xl font-bold mb-2">Actividades Extracurriculares</h2>
      <p className="text-gray-400 text-sm mb-6">
        Cuatrimestre Ene - Abr 2026. Selecciona la actividad en la que participas.
      </p>

      {/* Actividad seleccionada actual */}
      {guardado && seleccionada && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
          <FaCircleCheck size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-green-800">{seleccionada.nombre}</p>
            {seleccionada.lugar ? (
              <>
                <p className="text-sm text-green-700 flex items-center gap-1 mt-0.5">
                  <FaLocationDot size={11} /> {seleccionada.lugar}
                </p>
                <div className="flex flex-wrap gap-x-4 mt-1">
                  {seleccionada.horarios?.map((h, i) => (
                    <p key={i} className="text-xs text-green-600">
                      <FaClock size={10} className="inline mr-1" />{h.dia}: {h.hora}
                    </p>
                  ))}
                </div>
              </>
            ) : (
              <div className="mt-0.5">
                <p className="text-sm text-green-700 flex items-center gap-1">
                  <FaUserTie size={11} /> {seleccionada.encargado}
                </p>
                <p className="text-sm text-green-700 flex items-center gap-1 mt-0.5">
                  <FaBuilding size={11} /> {seleccionada.departamento}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-5 py-2 rounded-full font-semibold text-sm transition
              ${tab === key ? "bg-[#18AD8F] text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-[#18AD8F]"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {tab === "programas"
          ? programas.map((prog, i) => <TarjetaPrograma key={i} programa={prog} seleccionada={seleccionada} onSeleccionar={handleSeleccionar} />)
          : lista.map((act, i) => <TarjetaActividad key={i} actividad={act} seleccionada={seleccionada} onSeleccionar={handleSeleccionar} />)
        }
      </div>

      {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

      {/* Botón guardar */}
      {seleccionada && !guardado && (
        <div className="flex justify-center">
          <button onClick={handleGuardar} disabled={guardando}
            className="bg-[#18AD8F] text-white font-bold px-8 py-3 rounded-full hover:bg-[#149B80] hover:scale-105 transition disabled:opacity-50">
            {guardando ? "Guardando..." : "Guardar actividad seleccionada"}
          </button>
        </div>
      )}
    </>
  )
}

export default Actividades
