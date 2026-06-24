import {NavLink} from "react-router-dom"
import{Link} from "react-router-dom"
import SFlogo from "../assets/sociafast_logo.png"
import {FaXmark, FaBars, FaHouseChimney, FaClipboardList, FaClock, FaFileLines, FaFolderOpen, FaCalendarDays, FaUser, FaRightFromBracket} from "react-icons/fa6"

function Sidebar() {
  return (
    <aside className="w-64 bg-[#18AD8F] text-white flex flex-col">

      <div className="p-6 border-b border-white/20">

      <div className="flex items-center justify-end">
      <FaXmark size={22}/>
      </div>

      <FaBars size={22}/>

        <img
          src={SFlogo}
          alt="SociaFast"
          className="w-40 mx-auto"
        />

      </div>

      <nav className="flex flex-col gap-2 p-4">

        <NavLink to="/dashboardAlumno" className={({isActive}) => `flex items-center gap-3 w-full p-3 rounded-lg transition ${isActive ? "bg-white/25 font-semibold" : "hover:bg-white/20"}`}>
        <FaHouseChimney size={22}/>
        <span>Inicio</span>
        </NavLink>

        <Link to="/horas" className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/20 transition">
        <FaClock size={20}/>
        <span>Mis horas</span>
        </Link>

        <Link to="/registro-servicio" className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/20 transition">
        <FaFolderOpen size={22}/>
        <span>Subir evidencias</span>
        </Link>

        <Link to="/documentos" className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/20 transition">
        <FaFileLines size={22}/>
        <span>Generar reporte</span>
        </Link>

        <Link to="/registro-servicio" className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/20 transition">
        <FaClipboardList size={22}/>
        <span>Historial</span>
        </Link>

        <Link to="/registro-servicio" className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/20 transition">
        <FaCalendarDays size={22}/>
        <span>Actividades extracurriculares</span>
        </Link>

      </nav>

      <div className="mt-auto p-4 border-t border-white/20">
      <Link to="/perfil" className="flex items-center gap-3 w-full p-5 rounded-lg hover:bg-white/20 transition">
      <FaUser size={22}/>
      <span>Perfil</span>
      </Link>

        <button className="flex items-center gap-2 w-full bg-white/10 rounded-lg p-4 hover:bg-red-500/60 transition">
        <FaRightFromBracket size={22}/>
          Cerrar sesión
        </button>

      </div>

    </aside>
  )
}

export default Sidebar