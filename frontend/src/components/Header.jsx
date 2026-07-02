import { FaBell, FaBars } from "react-icons/fa6"

function Header({ setSidebarOpen, user }) {
  function getInitials(nombre = "") {
    return nombre.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
  }

  return (
    <header className="bg-white shadow-sm px-6 py-4">
      <div className="flex sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <button className="md:hidden text-[#18AD8F]" onClick={() => setSidebarOpen(true)}>
            <FaBars size={22} />
          </button>
          <h1 className="text-xl ml-2 md:text-2xl font-bold">
            Bienvenid@ a SociaFast, {user?.nombre ?? "..."}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {/* Avatar con iniciales */}
          <div className="w-9 h-9 rounded-full bg-[#18AD8F] text-white flex items-center justify-center font-bold text-sm">
            {getInitials(user?.nombre)}
          </div>
          <div className="relative text-[#18AD8F] hover:text-[#149B80] hover:scale-110 transition-all duration-200 cursor-pointer">
            <FaBell size={25} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">2</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header