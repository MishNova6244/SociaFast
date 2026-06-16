import Sidebar from "../components/SideBar"
import {Link} from "react-router"

function DashboardAlumno() {
  return (
    <div className="flex h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              Bienvenid@ a SociaFast
            </h1>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#18AD8F] flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <h2 className="text-3xl font-bold mb-6">
            Dashboard
          </h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500">
                Horas registradas
              </h3>
              <p className="text-4xl font-bold mt-2">
                120
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500">
                Documentos
              </h3>
              <p className="text-4xl font-bold mt-2">
                3
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500">
                Estado
              </h3>
              <p className="text-xl font-bold text-green-600 mt-2">
                Activo
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardAlumno