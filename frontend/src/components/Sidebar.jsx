import { Link } from "react-router-dom"
import SFlogo from "../assets/sociafast_logo.png"

function Sidebar() {
  return (
    <aside className="w-64 bg-[#18AD8F] text-white flex flex-col">

      <div className="p-6 border-b border-white/20">

        <img
          src={SFlogo}
          alt="SociaFast"
          className="w-32 mx-auto"
        />

      </div>

      <nav className="flex flex-col gap-2 p-4">

        <Link
          to="/dashboard"
          className="p-3 rounded-lg hover:bg-white/20 transition"
        >
          🏠 Inicio
        </Link>

        <Link
          to="/registro-servicio"
          className="p-3 rounded-lg hover:bg-white/20 transition"
        >
          📝 Registro
        </Link>

        <Link
          to="/horas"
          className="p-3 rounded-lg hover:bg-white/20 transition"
        >
          ⏱ Horas
        </Link>

        <Link
          to="/documentos"
          className="p-3 rounded-lg hover:bg-white/20 transition"
        >
          📄 Documentos
        </Link>

      </nav>

      <div className="mt-auto p-4 border-t border-white/20">
      <Link
          to="/perfil"
          className="p-3 rounded-lg hover:bg-white/20 transition"
        >
          👤 Perfil
        </Link>

        <button className="w-full bg-white/10 rounded-lg p-3 hover:bg-white/20 transition">
          Cerrar sesión
        </button>

      </div>

    </aside>
  )
}

export default Sidebar