import { useState } from "react"
import { NavLink } from "react-router-dom"
import SFlogo from "../assets/sociafast_logo.png"
import {
  FaXmark, FaHouseChimney, FaClipboardList, FaClock,
  FaFileLines, FaFolderOpen, FaCalendarDays, FaUser,
  FaRightFromBracket
} from "react-icons/fa6"

function Sidebar({ sidebarOpen, setSidebarOpen, onLogout }) {
  const [confirmar, setConfirmar] = useState(false)

  return (
    <>
      {/* Ajustar Sidebar para mostrarse o esconderse según la pantalla del dispositivo */}
      <aside className={`fixed md:static top-0 left-0 h-full md:h-auto w-64 bg-[#18AD8F] text-white flex flex-col overflow-y-auto z-50 transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>

        <div className="p-6 border-b border-white/20">
          {/* Botón de cerrar (X) en la parte superior de la Sidebar en dispositivos móviles */}
          <div className="flex items-center justify-end md:hidden cursor-pointer" onClick={() => setSidebarOpen(false)}>
            <FaXmark size={22} />
          </div>
          <img src={SFlogo} alt="SociaFast" className="w-35 md:w-40 mx-auto" />
        </div>

        {/* Secciones del Sidebar */}
        <nav className="flex flex-col gap-2 p-4">
          <NavLink to="" end className={({ isActive }) =>
            `flex items-center gap-3 w-full p-3 rounded-lg transition ${isActive ? "bg-white/25 font-semibold" : "hover:bg-white/20"}`}>
            <FaHouseChimney size={22} /><span>Inicio</span>
          </NavLink>
          <NavLink to="horas" className={({ isActive }) =>
            `flex items-center gap-3 w-full p-3 rounded-lg transition ${isActive ? "bg-white/25 font-semibold" : "hover:bg-white/20"}`}>
            <FaClock size={20} /><span>Mis horas</span>
          </NavLink>
          <NavLink to="evidencias" className={({ isActive }) =>
            `flex items-center gap-3 w-full p-3 rounded-lg transition ${isActive ? "bg-white/25 font-semibold" : "hover:bg-white/20"}`}>
            <FaFolderOpen size={22} /><span>Subir evidencias</span>
          </NavLink>
          <NavLink to="reportes" className={({ isActive }) =>
            `flex items-center gap-3 w-full p-3 rounded-lg transition ${isActive ? "bg-white/25 font-semibold" : "hover:bg-white/20"}`}>
            <FaFileLines size={22} /><span>Generar reportes</span>
          </NavLink>
          <NavLink to="historial" className={({ isActive }) =>
            `flex items-center gap-3 w-full p-3 rounded-lg transition ${isActive ? "bg-white/25 font-semibold" : "hover:bg-white/20"}`}>
            <FaClipboardList size={22} /><span>Historial</span>
          </NavLink>
          <NavLink to="actividades" className={({ isActive }) =>
            `flex items-center gap-3 w-full p-3 rounded-lg transition ${isActive ? "bg-white/25 font-semibold" : "hover:bg-white/20"}`}>
            <FaCalendarDays size={22} /><span>Actividades extracurriculares</span>
          </NavLink>
        </nav>

        <div className="mt-auto p-4 border-t border-white/20">
          <NavLink to="perfil" className={({ isActive }) =>
            `flex items-center gap-3 w-full p-3 rounded-lg transition ${isActive ? "bg-white/25 font-semibold" : "hover:bg-white/20"}`}>
            <FaUser size={22} /><span>Perfil</span>
          </NavLink>
          <button
            onClick={() => setConfirmar(true)}
            className="flex items-center mt-2 gap-2 w-full bg-white/10 rounded-lg p-4 hover:bg-red-500/60 transition"
          >
            <FaRightFromBracket size={22} />Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Modal de confirmacion */}
      {confirmar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Cerrar sesión</h3>
            <p className="text-gray-500 mb-6">¿Seguro que quieres cerrar sesión?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmar(false)}
                className="flex-1 border border-gray-300 text-gray-600 font-semibold py-2 rounded-lg hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button
                onClick={onLogout}
                className="flex-1 bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar