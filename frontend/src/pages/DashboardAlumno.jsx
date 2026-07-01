import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import {Outlet} from "react-router-dom"
import {useState} from "react"

function DashboardAlumno() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>

      <div className="flex-1 flex flex-col">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-6 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardAlumno