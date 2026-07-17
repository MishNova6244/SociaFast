import { useState } from "react"
import Input from "../../components/Input"
import TextArea from "../../components/TextArea"
import { FaFileLines } from "react-icons/fa6"

function Reportes() {

    const [loading, setLoading] = useState(false)

    return (
        <>
            <h2 className="text-3xl font-bold mb-6">Generar Reportes</h2>

            <div className="flex flex-col items-center gap-6">
                <div className="w-full max-w-2xl bg-white rounded-xl shadow p-8">
                    <div className="flex flex-col mb-8">
                    {/* Formulario de información necesaria para rellenar los formatos del reporte */}
                    <h2 className="text-3xl text-center font-bold mt-4 mb-6">Formulario de Generación de Documentos</h2>
                    <p className="text-gray-500 text-left text-sm md:text-lg mb-4">
                        Para generar el reporte, favor de completar la siguiente información:
                    </p>
                    <div className="w-full flex justify-start mb-4">
                    <span className="inline-block text-white bg-[#18AD8F] px-3 py-1 rounded-2xl md:rounded-full max-w-full mt-2">
                        <h2 className="text-lg md:text-xl font-bold break-words">Información personal</h2>
                    </span>
                    </div>
                    <Input label="Teléfono:" type="tel" placeholder="Ejemplo: 6561234567"/>
                    <div className="w-full flex justify-start mt-2 mb-4">
                    <span className="inline-block text-white bg-[#18AD8F] px-3 py-1 rounded-2xl md:rounded-full max-w-full mt-2">
                        <h2 className="text-lg md:text-xl font-bold break-words">Información del área de servicio social</h2>
                    </span>
                    </div>
                    <Input label="Nombre de la institución receptora:" placeholder="Ingrese el nombre de la institución"/>
                    <Input label="Dirección:" placeholder="Ingrese la dirección de la institución"/>
                    <Input label="Teléfono de la institución:" type="tel" placeholder="Ejemplo: 6561234567"/>
                    <Input label="Supervisor a cargo:" placeholder="Ingrese el nombre del supervisor/encargado"/>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                        <Input label="Fecha de inicio:" type="date" />
                        <Input label="Fecha de término:" type="date" />
                    </div>
                    <Input label="Programa educativo de servicio social:" placeholder="Ingrese el nombre del programa educativo"/>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                        <Input label="Horario de entrada:" type="time" />
                        <Input label="Horario de salida:" type="time" />
                    </div>
                    <div className="w-full flex justify-start mt-2 mb-4">
                    <span className="inline-block text-white bg-[#18AD8F] px-3 py-1 rounded-2xl md:rounded-full max-w-full mt-2">
                        <h2 className="text-lg md:text-xl font-bold break-words">Descripción de actividades</h2>
                    </span>
                    </div>
                    <p className="text-gray-500 text-left text-sm md:text-lg mb-4">De una manera objetiva, explique cada una de las actividades más
                        relevantes que realizó durante su Servicio Social:</p>
                        <TextArea label="Actividades realizadas:"/>
                        <p className="text-gray-500 text-left text-sm mb-4">
                            La información guardada se utilizará para rellenar automáticamente los formatos.
                        </p>
                    <div className="flex justify-center mt-4">
                    <button
                        disabled={loading}
                        className="bg-[#06B800] font-bold text-white px-6 py-2 rounded-full hover:bg-green-800 hover:scale-105 transition duration-200">
                        {loading ? "Guardando..." : "Guardar información"}
                    </button>
                    </div>
                    </div>
                </div>
                <div className="w-full max-w-2xl flex flex-col gap-4 mt-4">
                     <h3 className="text-xl font-bold text-gray-700 px-4">Documentos a generar:</h3>
                {/* Fila 1 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#18AD8F]/10 text-[#18AD8F] flex items-center justify-center shrink-0">
                            <FaFileLines size={20} />
                        </div>
                        <span className="text-base md:text-lg font-semibold text-gray-700">
                            Registro de Control de Horas de Servicio Social
                        </span>
                    </div>
                    <button 
                        disabled={loading} 
                        className="w-full sm:w-auto bg-[#168A5E] font-bold text-white px-6 py-2 rounded-full hover:bg-emerald-800 hover:scale-105 transition duration-200 sm:self-center self-start">
                        {loading ? "Generando..." : "Generar PDF"}
                    </button>
                </div>

                {/* Fila 2 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#18AD8F]/10 text-[#18AD8F] flex items-center justify-center shrink-0">
                                <FaFileLines size={20} />
                            </div>
                        <span className="text-base md:text-lg font-semibold text-gray-700">
                            Reporte Final de Actividades
                        </span>
                    </div>
                    <button 
                        disabled={loading} 
                        className="w-full sm:w-auto bg-[#168A5E] font-bold text-white px-6 py-2 rounded-full hover:bg-emerald-800 hover:scale-105 transition duration-200 sm:self-center self-start">
                        {loading ? "Generando..." : "Generar PDF"}
                    </button>
                </div>
                </div>

            </div>
        </>
    )
}

export default Reportes