import { useState } from "react"
import { NavLink } from "react-router-dom"
import SFlogo from "../assets/sociafast_logo.png"
import {
  FaXmark, FaUsers, FaFolderOpen, FaFileSignature,
  FaClockRotateLeft, FaRobot, FaUser, FaRightFromBracket,
  FaCalendarCheck
} from "react-icons/fa6"

function SidebarEncargado({ sidebarOpen, setSidebarOpen, onLogout }) {
  const [confirmar, setConfirmar] = useState(false)

  const nav = [
    { to: "",             icon: <FaUsers size={20} />,           label: "Alumnos registrados" },
    { to: "evidencias",   icon: <FaFolderOpen size={20} />,      label: "Evidencias pendientes" },
    { to: "reportes",     icon: <FaFileSignature size={20} />,   label: "Reportes por firmar" },
    { to: "historial",    icon: <FaClockRotateLeft size={20} />, label: "Historial de aprobaciones" },
    { to: "asistencias",  icon: <FaCalendarCheck size={20} />,   label: "Asistencias"},
    { to: "detector-ia",  icon: <FaRobot size={20} />,           label: "Detector de IA" },
  ]

  return (
    <>
      <aside className={`fixed md:sticky top-0 left-0 h-full md:h-screen w-64 bg-[#1f7561] text-white flex flex-col overflow-y-auto z-50 transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>

        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-end md:hidden cursor-pointer" onClick={() => setSidebarOpen(false)}>
            <FaXmark size={22} />
          </div>
          <img src={SFlogo} alt="SociaFast" className="w-35 md:w-40 mx-auto" />
        </div>

        <nav className="flex flex-col gap-2 p-4">
          {nav.map(({ to, icon, label }) => (
            <NavLink key={to} to={to} end={to === ""}
              className={({ isActive }) =>
                `flex items-center gap-3 w-full p-3 rounded-lg transition ${isActive ? "bg-white/25 font-semibold" : "hover:bg-white/20"}`}>
              {icon}<span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto p-4 border-t border-white/20">
          <NavLink to="perfil" className={({ isActive }) =>
            `flex items-center gap-3 w-full p-3 rounded-lg transition ${isActive ? "bg-white/25 font-semibold" : "hover:bg-white/20"}`}>
            <FaUser size={20} /><span>Perfil</span>
          </NavLink>
          <button onClick={() => setConfirmar(true)}
            className="flex items-center mt-2 gap-2 w-full bg-white/10 rounded-lg p-4 hover:bg-red-500/60 transition">
            <FaRightFromBracket size={20} />Cerrar sesión
          </button>
        </div>
      </aside>

      {confirmar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Cerrar sesión</h3>
            <p className="text-gray-500 mb-6">¿Seguro que quieres cerrar sesión?</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmar(false)}
                className="flex-1 border border-gray-300 text-gray-600 font-semibold py-2 rounded-lg hover:bg-gray-100 transition">
                Cancelar
              </button>
              <button onClick={onLogout}
                className="flex-1 bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition">
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SidebarEncargado
