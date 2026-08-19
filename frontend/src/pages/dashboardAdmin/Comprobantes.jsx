import { FaCircleCheck } from "react-icons/fa6"
import ResponsiveTable from "../../components/ResponsiveTable"

const COMPROBANTES = [
  { folio: "SF-001", alumno: "Ana García López",   matricula: "25310201", documento: "Control de Horas", fecha: "20 Jul 2026" },
  { folio: "SF-002", alumno: "Diana Torres Pérez", matricula: "25310203", documento: "Evaluación",       fecha: "22 Jul 2026" },
]

function Comprobantes() {
  const headers = [
    { key: "folio",     label: "Folio" },
    { key: "alumno",    label: "Alumno" },
    { key: "documento", label: "Documento" },
    { key: "fecha",     label: "Fecha" },
    { key: "badge",     label: "Estado" },
  ]

  const rows = COMPROBANTES.map((c) => ({
    folio:     <span className="font-mono text-[#1A3A5C] font-bold">{c.folio}</span>,
    alumno:    <div><p className="font-semibold text-gray-700">{c.alumno}</p><p className="text-xs text-gray-400">{c.matricula}</p></div>,
    documento: c.documento,
    fecha:     c.fecha,
    badge:     <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full whitespace-nowrap"><FaCircleCheck size={11} /> Emitido</span>,
  }))

  return (
    <>
      <h2 className="text-3xl font-bold mb-6">Comprobantes Emitidos</h2>
      <div className="bg-white rounded-xl shadow p-6">
        <ResponsiveTable headers={headers} rows={rows} />
      </div>
    </>
  )
}

export default Comprobantes
