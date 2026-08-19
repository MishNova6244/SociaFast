import { useState, useRef, useEffect } from "react"
import { FaBell, FaCircleCheck, FaCircleXmark, FaFileLines, FaStamp, FaXmark } from "react-icons/fa6"

// Notificaciones de ejemplo — reemplazar con datos reales del backend
const NOTIFICACIONES_EJEMPLO = [
  {
    id: 1,
    tipo: "aprobado",
    titulo: "Documento aprobado",
    mensaje: "Tu Control de Horas fue aprobado por el encargado.",
    fecha: "Hace 5 min",
    leida: false,
  },
  {
    id: 2,
    tipo: "rechazado",
    titulo: "Documento rechazado",
    mensaje: "Tu Reporte Final fue rechazado. Revisa los comentarios.",
    fecha: "Hace 1 hora",
    leida: false,
  },
  {
    id: 3,
    tipo: "sello",
    titulo: "Sello aplicado",
    mensaje: "El administrador aplicó el sello a tu constancia.",
    fecha: "Hace 2 horas",
    leida: true,
  },
  {
    id: 4,
    tipo: "documento",
    titulo: "Nuevo documento subido",
    mensaje: "Ana García subió su Reporte Final para revisión.",
    fecha: "Ayer",
    leida: true,
  },
]

const TIPO_CONFIG = {
  aprobado: { icon: <FaCircleCheck size={16} />, color: "text-green-500 bg-green-50" },
  rechazado: { icon: <FaCircleXmark size={16} />, color: "text-red-500 bg-red-50" },
  sello:     { icon: <FaStamp size={16} />,       color: "text-[#1A3A5C] bg-blue-50" },
  documento: { icon: <FaFileLines size={16} />,   color: "text-[#18AD8F] bg-teal-50" },
}

function NotificacionesPanel() {
  const [abierto, setAbierto]               = useState(false)
  const [notifs, setNotifs]                 = useState(NOTIFICACIONES_EJEMPLO)
  const panelRef                            = useRef(null)

  const noLeidas = notifs.filter(n => !n.leida).length

  // Cierra el panel al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target))
        setAbierto(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const marcarLeida = (id) =>
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, leida: true } : n))

  const marcarTodasLeidas = () =>
    setNotifs(prev => prev.map(n => ({ ...n, leida: true })))

  return (
    <div className="relative" ref={panelRef}>
      {/* Ícono campana */}
      <button onClick={() => setAbierto(!abierto)}
        className="relative text-[#1f7561] hover:text-[#149B80] hover:scale-110 transition-all duration-200">
        <FaBell size={25} />
        {noLeidas > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">
            {noLeidas}
          </span>
        )}
      </button>

      {/* Panel de notificaciones */}
      {abierto && (
        <div className="absolute right-0 top-10 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          {/* Header del panel */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Notificaciones</h3>
            <div className="flex items-center gap-3">
              {noLeidas > 0 && (
                <button onClick={marcarTodasLeidas}
                  className="text-xs text-[#18AD8F] font-semibold hover:underline">
                  Marcar todas como leídas
                </button>
              )}
              <button onClick={() => setAbierto(false)} className="text-gray-400 hover:text-gray-600">
                <FaXmark size={16} />
              </button>
            </div>
          </div>

          {/* Lista de notificaciones */}
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {notifs.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">Sin notificaciones</p>
            ) : (
              notifs.map(n => {
                const cfg = TIPO_CONFIG[n.tipo] || TIPO_CONFIG.documento
                return (
                  <div key={n.id} onClick={() => marcarLeida(n.id)}
                    className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition
                      ${!n.leida ? "bg-teal-50/30" : ""}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.color}`}>
                      {cfg.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm font-semibold ${!n.leida ? "text-gray-800" : "text-gray-600"}`}>
                          {n.titulo}
                        </p>
                        {!n.leida && <span className="w-2 h-2 rounded-full bg-[#18AD8F] flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.mensaje}</p>
                      <p className="text-xs text-gray-400 mt-1">{n.fecha}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              {noLeidas > 0 ? `${noLeidas} notificación(es) sin leer` : "Todo al día ✓"}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificacionesPanel
