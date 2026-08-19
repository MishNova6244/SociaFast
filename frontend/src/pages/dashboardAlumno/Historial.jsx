import ResponsiveTable from "../../components/ResponsiveTable"

const HISTORIAL = [
  { cuatrimestre: "Ene-Abr 2025", actividad: "Voleibol", horas: 48, estado: "Completado",   encargado: "Juan Pérez" },
  { cuatrimestre: "May-Ago 2025", actividad: "Danza",    horas: 32, estado: "En progreso",  encargado: "María López" },
  { cuatrimestre: "Sep-Dic 2025", actividad: "Canto",    horas: 0,  estado: "Pendiente",    encargado: "—" },
]

const COLORES = {
  "Completado":  "text-green-700 bg-green-100",
  "En progreso": "text-yellow-700 bg-yellow-100",
  "Pendiente":   "text-gray-500 bg-gray-100",
}

function Historial() {
  const headers = [
    { key: "cuatrimestre", label: "Cuatrimestre" },
    { key: "actividad",    label: "Actividad" },
    { key: "horas",        label: "Horas" },
    { key: "badge",        label: "Estado" },
    { key: "encargado",    label: "Encargado" },
  ]

  const rows = HISTORIAL.map((h) => ({
    ...h,
    horas: `${h.horas}/48`,
    badge: (
      <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${COLORES[h.estado]}`}>
        {h.estado}
      </span>
    ),
  }))

  return (
    <>
      <h2 className="text-3xl font-bold mb-6">Historial</h2>
      <div className="bg-white rounded-xl shadow p-6">
        <ResponsiveTable headers={headers} rows={rows} />
      </div>
    </>
  )
}

export default Historial
