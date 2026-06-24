import Sidebar from "../components/Sidebar"
import {Link} from "react-router-dom"
import {FaBell} from "react-icons/fa6"

function DashboardAlumno() {
  return (
    <div className="flex h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              Bienvenid@ a SociaFast, "Nombre del alumno"
            </h1>
            <div className="flex items-center gap-3">
              <div className="relative text-[#18AD8F] hover:text-[#149B80] hover:scale-110 transition-all duration-200 cursor-pointer">
                <FaBell size={25}/>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <h2 className="text-3xl font-bold mb-6">
            Inicio
          </h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500">
                Horas registradas
              </h3>
              <p className="text-2xl font-bold mt-2">
                "Número de horas"
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500">
                Documentos generados
              </h3>
              <p className="text-2xl font-bold mt-2">
                "Número de documentos"
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500">
                Estado
              </h3>
              <p className="text-2xl font-bold text-green-600 mt-2">
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