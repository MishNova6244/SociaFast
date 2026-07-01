import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import { FaBell } from "react-icons/fa6"
import { usersApi } from "../services/api"

function DashboardAlumno() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Intentar cargar desde localStorage primero (evita un fetch innecesario al cargar)
    const cached = localStorage.getItem("user")
    if (cached) setUser(JSON.parse(cached))

    // Luego confirmar con el backend (por si el token expiró)
    usersApi.getMe()
      .then((data) => {
        const updated = { nombre: `${data.nombre} ${data.apellido_paterno}`, rol: data.rol }
        setUser(updated)
        localStorage.setItem("user", JSON.stringify({ ...updated, matricula: data.matricula }))
      })
      .catch(() => {
        // Token inválido o expirado: limpiar sesión y redirigir al login
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        navigate("/")
      })
  }, [])

  // Genera las iniciales del nombre para el avatar
  function getInitials(nombre = "") {
    return nombre.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              Bienvenid@ a SociaFast, {user?.nombre ?? "..."}
            </h1>
            <div className="flex items-center gap-3">
              {/* Avatar con iniciales */}
              <div className="w-9 h-9 rounded-full bg-[#18AD8F] text-white flex items-center justify-center font-bold text-sm">
                {getInitials(user?.nombre)}
              </div>
              <div className="relative text-[#18AD8F] hover:text-[#149B80] hover:scale-110 transition-all duration-200 cursor-pointer">
                <FaBell size={25} />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <h2 className="text-3xl font-bold mb-6">Inicio</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500">Horas registradas</h3>
              <p className="text-2xl font-bold mt-2">0</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500">Documentos generados</h3>
              <p className="text-2xl font-bold mt-2">0</p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500">Estado</h3>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {user ? "Activo" : "..."}
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardAlumno