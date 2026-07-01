import {FaCheck, FaHourglassHalf} from "react-icons/fa6"

function Home() {
    return (
        <>
        <h2 className="text-3xl font-bold mb-6">
            Inicio
        </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                    <div className="bg-white rounded-xl shadow p-6 mt-[55px] w-full min-h-[350px]">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                      <div className="flex-1 flex flex-col justify-center items-center lg:items-start">
                        <h3 className="mt-4 text-2xl font-bold mb-8 text-center">Resumen del progreso:</h3>
        
                        <p className="text-2xl font-bold text-center">48 / 240 horas</p>
                        <div className="flex justify-center">
                        <div className="w-52 sm:w-64 md:w-72 bg-gray-200 rounded-xl h-12 mt-4">
                          <div className="bg-green-500 h-12 rounded-xl w-[20%] transition-all duration-500"></div>
                        </div>
                        </div>
                        <div className="flex gap-2 justify-center">
                        <p className="mt-8 text-xl text-gray-600">Horas faltantes:</p>
                        <p className="mt-8 text-xl font-bold text-gray-600">"x horas"</p></div>
                        <div className="flex gap-2 justify-center">
                        <p className="mt-1 text-xl text-gray-600">Porcentaje completado:</p>
                        <p className="mt-1 text-xl font-bold text-gray-600">"x%"</p></div>
                      </div>
                        <div className="hidden lg:block w-px h-75 bg-gray-300"></div>
                        <div className="block lg:hidden h-px w-full bg-gray-300"></div>
                        <div className="flex-1">
                          <h3 className="mt-4 text-2xl font-bold mb-8 text-center">Etapas del progreso:</h3>
                          <div className="space-y-4 pl-0 lg:pl-16">
                           <p className="flex items-center gap-3 text-2xl">
                          <span className="w-9 h-9 rounded-full bg-green-500 text-white flex items-center justify-center">
                          <FaCheck size={20}/>
                          </span>
                          Registro de horas</p>
        
                          <p className="mr-auto flex items-center gap-3 text-2xl">
                          <span className="w-9 h-9 rounded-full bg-green-500 text-white flex items-center justify-center">
                          <FaCheck size={20}/>
                          </span>
                          Subida de evidencias</p>
        
                          <p className="flex items-center gap-3 text-2xl text-green-600 font-semibold">
                          <span className="w-9 h-9 rounded-full bg-gray-300 text-white flex items-center justify-center">
                          <FaHourglassHalf size={20}/>
                          </span>
                          Generación de reporte</p>
        
                          <p className="flex items-center gap-3 text-2xl text-gray-400">
                          <span className="w-9 h-9 rounded-full bg-gray-300 text-white flex items-center justify-center">
                          <FaHourglassHalf size={20}/> 
                          </span>
                          Aprobación final</p>
                      </div>
                      </div>
                    </div>
                </div>
        </>
    )
}

export default Home