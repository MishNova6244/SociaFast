import { FaBars } from "react-icons/fa6"
import NotificacionesPanel from "./NotificacionesPanel"

function HeaderEncargado({ setSidebarOpen, user }) {
  const getInitials = (name = "") =>
    name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()

  return (
    <header className="bg-white shadow-sm px-6 py-4">
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <button className="md:hidden text-[#1f7561]" onClick={() => setSidebarOpen(true)}>
            <FaBars size={22} />
          </button>
          <h1 className="text-xl md:text-2xl font-bold">
            Bienvenid@ a SociaFast,{" "}
            <span className="uppercase">{user?.full_name ?? "..."}</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1f7561] text-white flex items-center justify-center font-bold text-sm">
            {getInitials(user?.full_name)}
          </div>
          <NotificacionesPanel />
        </div>
      </div>
    </header>
  )
}

export default HeaderEncargado
