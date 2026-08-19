import { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import SidebarAdmin from "../components/SidebarAdmin"
import HeaderAdmin  from "../components/HeaderAdmin"

function DashboardAdmin() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const user = { full_name: "Admin SociaFast", role: "administrador" }

  function handleLogout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <SidebarAdmin sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderAdmin setSidebarOpen={setSidebarOpen} user={user} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  )
}

export default DashboardAdmin
