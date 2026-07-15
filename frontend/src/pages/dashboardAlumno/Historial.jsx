import { useOutletContext } from "react-router-dom"
import { FaCircleCheck, FaCircleXmark, FaHourglass, FaFileLines } from "react-icons/fa6"

const META = 48

const HISTORIAL_HORAS = [
  { cuatrimestre: "Cuatrimestre 1", periodo: "Ene - Abr 2024", horas: 48, estado: "aprobado" },
  { cuatrimestre: "Cuatrimestre 2", periodo: "May - Ago 2024", horas: 45, estado: "aprobado" },
  { cuatrimestre: "Cuatrimestre 3", periodo: "Sep - Dic 2024", horas: 48, estado: "aprobado" },
  { cuatrimestre: "Cuatrimestre 4", periodo: "Ene - Abr 2025", horas: 30, estado: "incompleto" },
  { cuatrimestre: "Cuatrimestre 5", periodo: "May - Ago 2025", horas: 48, estado: "aprobado" },
]

const HISTORIAL_REPORTES = [
  { nombre: "Reporte Cuatrimestre 1", fecha: "30 Abr 2024", tipo: "Servicio Social", estado: "aprobado" },
  { nombre: "Reporte Cuatrimestre 2", fecha: "31 Ago 2024", tipo: "Servicio Social", estado: "aprobado" },
  { nombre: "Reporte Cuatrimestre 3", fecha: "20 Dic 2024", tipo: "Servicio Social", estado: "aprobado" },
  { nombre: "Reporte Cuatrimestre 4", fecha: "30 Abr 2025", tipo: "Servicio Social", estado: "rechazado" },
  { nombre: "Reporte Cuatrimestre 5", fecha: "29 Ago 2025", tipo: "Servicio Social", estado: "aprobado" },
]

function EstadoBadge({ estado }) {
  const config = {
    aprobado:   { icon: <FaCircleCheck size={11} />,  label: "Aprobado",   cls: "text-green-700 bg-green-100" },
    incompleto: { icon: <FaCircleXmark size={11} />,  label: "Incompleto", cls: "text-red-600 bg-red-100" },
    rechazado:  { icon: <FaCircleXmark size={11} />,  label: "Rechazado",  cls: "text-red-600 bg-red-100" },
    en_curso:   { icon: <FaHourglass size={11} />,    label: "En curso",   cls: "text-yellow-700 bg-yellow-100" },
  }
  const { icon, label, cls } = config[estado] || config.en_curso
  return (
    <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${cls}`}>
      {icon} {label}
    </span>
  )
}

function Historial() {
  const { user } = useOutletContext() || {}
  const horasActual = user?.horas_acumuladas ?? 0
  const totalHoras  = HISTORIAL_HORAS.reduce((acc, c) => acc + c.horas, 0) + Number(horasActual)

  return (
    <>
      <h2 className="text-3xl font-bold mb-6">Historial</h2>

      <div className="flex flex-col gap-6">

        {/* ── Tabla de horas ── */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Horas por cuatrimestre</h3>
            <span className="text-sm text-gray-400">
              Total acumulado:{" "}
              <span className="font-bold text-[#18AD8F]">{totalHoras} hrs</span>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-gray-400 font-medium pb-3">Cuatrimestre</th>
                  <th className="text-left text-gray-400 font-medium pb-3">Periodo</th>
                  <th className="text-center text-gray-400 font-medium pb-3">Horas</th>
                  <th className="text-center text-gray-400 font-medium pb-3">Progreso</th>
                  <th className="text-center text-gray-400 font-medium pb-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {HISTORIAL_HORAS.map((c, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="py-3 font-semibold text-gray-700">{c.cuatrimestre}</td>
                    <td className="py-3 text-gray-400">{c.periodo}</td>
                    <td className="py-3 text-center font-bold text-gray-700">{c.horas}</td>
                    <td className="py-3 px-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="h-2 rounded-full" style={{
                          width: `${Math.min((c.horas / META) * 100, 100)}%`,
                          backgroundColor: c.estado === "aprobado" ? "#16a34a" : "#f59e0b",
                        }} />
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <div className="flex justify-center">
                        <EstadoBadge estado={c.estado} />
                      </div>
                    </td>
                  </tr>
                ))}

                <tr className="bg-[#18AD8F]/5 border-t-2 border-[#18AD8F]/30">
                  <td className="py-3 font-semibold text-[#18AD8F]">Cuatrimestre actual</td>
                  <td className="py-3 text-gray-400">2025 - 2026</td>
                  <td className="py-3 text-center font-bold text-[#18AD8F]">{horasActual}</td>
                  <td className="py-3 px-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="h-2 rounded-full bg-[#18AD8F] transition-all duration-500"
                        style={{ width: `${Math.min((horasActual / META) * 100, 100)}%` }} />
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    <div className="flex justify-center">
                      <EstadoBadge estado="en_curso" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Tabla de reportes ── */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-full bg-[#18AD8F]/10 text-[#18AD8F] flex items-center justify-center">
              <FaFileLines size={18} />
            </div>
            <h3 className="font-semibold text-lg">Reportes generados</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-gray-400 font-medium pb-3">Nombre del reporte</th>
                  <th className="text-left text-gray-400 font-medium pb-3">Fecha</th>
                  <th className="text-left text-gray-400 font-medium pb-3">Tipo</th>
                  <th className="text-center text-gray-400 font-medium pb-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {HISTORIAL_REPORTES.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <FaFileLines size={14} className="text-[#18AD8F]" />
                        <span className="font-semibold text-gray-700">{r.nombre}</span>
                      </div>
                    </td>
                    <td className="py-3 text-gray-400">{r.fecha}</td>
                    <td className="py-3 text-gray-500">{r.tipo}</td>
                    <td className="py-3 text-center">
                      <div className="flex justify-center">
                        <EstadoBadge estado={r.estado} />
                      </div>
                    </td>
                  </tr>
                ))}

                {HISTORIAL_REPORTES.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400">
                      No hay reportes generados aun
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-400 mt-6">
            * Los reportes se conectaran al backend cuando el modulo este implementado.
          </p>
        </div>

      </div>
    </>
  )
}

export default Historial