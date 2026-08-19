import { useState } from "react"

import { FaFileWord, FaUpload, FaCircleCheck, FaHourglass, FaCircle, FaCircleXmark } from "react-icons/fa6"

// Solo los documentos que llena el alumno — Evaluación de desempeño la llena el encargado
const DOCUMENTOS = [
  {
    id: "control",
    titulo: "Control de Horas",
    descripcion: "Formato de control y registro de horas del servicio social",
    archivo: "/documents/control_de_horas.docx",
    nombreArchivo: "F-BU-10_Control_Horas.docx",
  },
  {
    id: "reporte",
    titulo: "Reporte Final",
    descripcion: "Formato del reporte final del servicio social",
    archivo: "/documents/reporte_final.docx",
    nombreArchivo: "F-BU-11_Reporte_Final.docx",
  },
]

function EstadoBadge({ estado }) {
  const config = {
    pendiente: { icon: <FaCircle size={11} />,      label: "Pendiente",   cls: "text-gray-500 bg-gray-100" },
    subido:    { icon: <FaHourglass size={11} />,   label: "En revisión", cls: "text-yellow-700 bg-yellow-100" },
    aprobado:  { icon: <FaCircleCheck size={11} />, label: "Aprobado",    cls: "text-green-700 bg-green-100" },
    rechazado: { icon: <FaCircleXmark size={11} />, label: "Rechazado",   cls: "text-red-600 bg-red-100" },
  }
  const { icon, label, cls } = config[estado] || config.pendiente
  return (
    <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full w-fit ${cls}`}>
      {icon} {label}
    </span>
  )
}

function TarjetaDocumento({ doc, estado, archivoSubido, onSubir }) {
  const [dragging, setDragging] = useState(false)

  return (
    <div className={`bg-white rounded-xl shadow p-6 flex flex-col gap-4 border-2 transition-all
      ${estado === "aprobado"  ? "border-green-300" :
        estado === "rechazado" ? "border-red-300"   :
        estado === "subido"    ? "border-yellow-300" : "border-transparent"}`}>

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
          <FaFileWord size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-800">{doc.titulo}</h3>
          <p className="text-xs text-gray-400 mt-1">{doc.descripcion}</p>
        </div>
        <EstadoBadge estado={estado} />
      </div>

      {archivoSubido && (
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-600">
          <FaFileWord size={14} className="text-blue-400" />
          <span className="truncate">{archivoSubido}</span>
        </div>
      )}

      {estado !== "aprobado" && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); onSubir(doc.id, e.dataTransfer.files[0]) }}
          className={`border-2 border-dashed rounded-lg p-4 text-center transition-all
            ${dragging ? "border-[#18AD8F] bg-[#18AD8F]/5" : "border-gray-300 bg-gray-50"}`}>
          <p className="text-xs text-gray-400 mb-2">Arrastra el documento aquí o</p>
          <label className="cursor-pointer inline-flex items-center gap-2 bg-[#18AD8F] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#149B80] transition">
            <FaUpload size={12} /> Subir documento
            <input type="file" accept=".docx,.pdf" className="hidden"
              onChange={(e) => onSubir(doc.id, e.target.files[0])} />
          </label>
          <p className="text-xs text-gray-300 mt-2">Formatos: .docx, .pdf</p>
        </div>
      )}
    </div>
  )
}

function Evidencias() {
  const [docs, setDocs] = useState({
    control: { estado: "pendiente", archivoSubido: null },
    reporte: { estado: "pendiente", archivoSubido: null },
  })

  function handleSubir(id, file) {
    if (!file) return
    setDocs(prev => ({ ...prev, [id]: { estado: "subido", archivoSubido: file.name } }))
  }

  const aprobados = Object.values(docs).filter(d => d.estado === "aprobado").length
  const subidos   = Object.values(docs).filter(d => d.estado === "subido").length

  return (
    <>
      <h2 className="text-3xl font-bold mb-2">Subir Evidencias</h2>
      <p className="text-gray-400 text-sm mb-6">
  Sube tus documentos del servicio social. El encargado validará cada uno.
</p>

      <div className="flex gap-4 mb-6">
        <div className="bg-white rounded-xl shadow px-5 py-3 flex items-center gap-3">
          <FaCircleCheck size={18} className="text-green-500" />
          <div>
            <p className="text-xs text-gray-400">Aprobados</p>
            <p className="font-bold text-lg">{aprobados} / 2</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow px-5 py-3 flex items-center gap-3">
          <FaHourglass size={18} className="text-yellow-500" />
          <div>
            <p className="text-xs text-gray-400">En revisión</p>
            <p className="font-bold text-lg">{subidos} / 2</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {DOCUMENTOS.map(doc => (
          <TarjetaDocumento key={doc.id} doc={doc}
            estado={docs[doc.id].estado} archivoSubido={docs[doc.id].archivoSubido}
            onSubir={handleSubir} />
        ))}
      </div>
    </>
  )
}

export default Evidencias
