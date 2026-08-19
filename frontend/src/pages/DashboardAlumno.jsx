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
    // Carga instantánea desde caché para evitar pantalla en blanco
    const cached = localStorage.getItem("user")
    if (cached) setUser(JSON.parse(cached))

    usersApi.getMe()
      .then((data) => {
        const updated = {
          full_name: `${data.first_name} ${data.paternal_surname} ${data.maternal_surname || ""}`.trim(),
          student_id: data.student_id,
          role: data.role,
          email: data.institutional_email,
          failed_attempts: data.failed_attempts ?? 0,
          accumulated_hours: data.accumulated_hours ?? 0,
        }
        setUser(updated)
        localStorage.setItem("user", JSON.stringify(updated))
      })
      .catch(() => {})
  }, [])

  return (
    <div className = "flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar sidebarOpen = {sidebarOpen} setSidebarOpen = {setSidebarOpen} onLogout = {handleLogout} />
      <div className = "flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen = {setSidebarOpen} user = {user} />

        {user?.failed_attempts > 0 && (
          <div className = "mx-6 mt-4 p-3 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-lg text-sm">
            Tu cuenta tuvo {user.failed_attempts} intento(s) de acceso fallido(s) recientes.
          </div>
        )}

        <main className = "flex-1 p-6 overflow-auto">
          {/* user y setUser disponibles para todas las subpáginas via Outlet context */}
          <Outlet context={{ user, setUser }} />
        </main>
      </div>
    </div>
  )
}

export default DashboardAlumno