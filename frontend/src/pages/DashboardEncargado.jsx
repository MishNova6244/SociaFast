import { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import SidebarEncargado from "../components/SidebarEncargado"
import HeaderEncargado from "../components/HeaderEncargado"

function DashboardEncargado() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Usuario de ejemplo — se conectará al backend
  const [user, setUser] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("user") || "null")
    return stored || { full_name: "Juan Pérez López", role: "encargado",
      email: "juan.perez@utpn.edu.mx", assigned_activity: "Voleibol" }
  })

  function handleLogout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <SidebarEncargado sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col min-w-0">
        <HeaderEncargado setSidebarOpen={setSidebarOpen} user={user} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet context={{ user, setUser }} />
        </main>
      </div>
    </div>
  )
}

export default DashboardEncargado
