import { useState } from "react"
import {FaCircleUser, FaXmark, FaArrowLeft } from "react-icons/fa6"

function ModalFichaAlumno({ alumnos, onClose }) {
    const [detalleAlumno, setDetalleAlumno] = useState(null)

    if(!alumnos || alumnos.length === 0) return null

    const cerrarTodo = () => {
        setDetalleAlumno(null)
        onClose()
    }

    // -- Datos y cálculos para la barra de progreso y ficha de un alumno --
    if (detalleAlumno){
        const horasCompletadas = detalleAlumno.horasCompletadas ?? 0
        const horasTotales = detalleAlumno.horasTotales ?? 240
        const porcentaje = Math.round((horasCompletadas / horasTotales) * 100)

        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm relative">
                    <button onClick={() => setDetalleAlumno(null)}
                        className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition">
                        <FaArrowLeft size={18} />
                    </button>
                    <button onClick={cerrarTodo}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition">
                        <FaXmark size={20} />
                    </button>

                <div className="flex flex-col items-center text-center">
                    <FaCircleUser className="w-24 h-24 text-gray-300" />
                    <h3 className="text-xl font-bold mt-4">{detalleAlumno.nombre}</h3>
                    <p className="text-gray-400 text-sm">Matrícula: {detalleAlumno.matricula}</p>

                    <div className="w-full mt-4 space-y-2 text-left">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Grupo:</span>
                            <span className="font-semibold">{detalleAlumno.grupo}</span>
                        </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Cuatrimestre:</span>
                        <span className="font-semibold">{detalleAlumno.cuatrimestre}°</span>
                    </div>

                     <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Carrera:</span>
                        <span className="font-semibold">{detalleAlumno.carrera}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Actividad:</span>
                        <span className="font-semibold">{detalleAlumno.actividad}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Estado:</span>
                        <span className={`font-semibold ${detalleAlumno.completado ? "text-green-600" : "text-yellow-600"}`}>
                            {detalleAlumno.completado ? "Completado" : "En progreso"}
                        </span>
                    </div>
                </div>

                {/* Barra de progreso */}
                <div className="w-full mt-5">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progreso de horas</span>
                        <span>{horasCompletadas} / {horasTotales} hrs</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="h-3 rounded-full bg-[#18AD8F] transition-all"
                            style={{ width: `${porcentaje}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1 text-center">{porcentaje}%</p>
                </div>
            </div>
        </div>
    </div>
    )
}

// Vista de lista si hay más de un alumno
return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm relative max-h-[80hv] overflow-y-auto">
            <button onClick={cerrarTodo}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition">
                <FaXmark size={20} />
            </button>

            <h3 className="text-lg font-bold mb-4">Alumnos ({alumnos.length})</h3>

            <div className="space-y-2">
                {alumnos.map(al => (
                    <button
                        key={al.matricula}
                        onClick={() => setDetalleAlumno(al)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition text-left"
                    >
                        <FaCircleUser className="w-10 h-10 text-gray-300 shrink-0" />
                        <div>
                            <p className="font-semibold text-sm">{al.nombre}</p>
                            <p className="text-xs text-gray-400">Matrícula: {al.matricula} - Grupo: {al.grupo}</p>
                        </div>
                    </button>
                ))}

            </div>
        </div>
    </div>
    )
}

export default ModalFichaAlumno