import { useEffect, useState } from "react"
import { useNavigate, Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import Header  from "../components/Header"
import { usersApi } from "../services/api"

function DashboardAlumno() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)

  function handleLogout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  useEffect(() => {
    const cached = localStorage.getItem("user")
    if (cached) setUser(JSON.parse(cached))

    usersApi.getMe()
      .then((data) => {
        const updated = {
          nombre: `${data.nombre} ${data.apellido_paterno} ${data.apellido_materno || ""}`.trim(),
          matricula: data.matricula,
          rol: data.rol,
          correo: data.correo_institucional,
          intentos_fallidos: data.intentos_fallidos ?? 0,
          horas_acumuladas: data.horas_acumuladas ?? 0,
        }
        setUser(updated)
        localStorage.setItem("user", JSON.stringify(updated))
      })
      .catch(() => {})
  }, [])

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} user={user} />

        {user?.intentos_fallidos > 0 && (
          <div className="mx-6 mt-4 p-3 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-lg text-sm">
            Tu cuenta tuvo {user.intentos_fallidos} intento(s) de acceso fallido(s) recientes.
          </div>
        )}

        <main className="flex-1 p-6 overflow-auto">
          {/* Pasamos user y setUser para que subpáginas puedan actualizar el estado global */}
          <Outlet context={{ user, setUser }} />
        </main>
      </div>
    </div>
  )
}

export default DashboardAlumno