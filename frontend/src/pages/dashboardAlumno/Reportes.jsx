import { useState } from "react"
import { useOutletContext } from "react-router-dom"
import Input from "../../components/Input"
import TextArea from "../../components/TextArea"
import { FaFileLines, FaDownload } from "react-icons/fa6"
import { documentosApi, descargarBlob } from "../../services/api"

function Reportes() {
  const { user } = useOutletContext() || {}
  const [form, setForm] = useState({
    telefono: "", institucion: "", direccion: "", tel_institucion: "",
    supervisor: "", fecha_inicio: "", fecha_fin: "", programa: "",
    hora_entrada: "", hora_salida: "", actividades: "",
  })
  const [errors, setErrors]             = useState({})
  const [guardado, setGuardado]         = useState(false)
  const [generando, setGenerando]       = useState(null) // "reporte" | "control" | null
  const [errorGeneracion, setErrorGeneracion] = useState("")

  const set = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
    if (errors[field]) setErrors({ ...errors, [field]: "" })
  }

  function validate() {
    const e = {}
    if (!form.telefono.trim())        e.telefono        = "El teléfono es obligatorio"
    else if (!/^\d{10}$/.test(form.telefono)) e.telefono = "Debe tener 10 dígitos"
    if (!form.institucion.trim())     e.institucion     = "La institución es obligatoria"
    if (!form.supervisor.trim())      e.supervisor      = "El supervisor es obligatorio"
    if (!form.fecha_inicio)           e.fecha_inicio    = "La fecha de inicio es obligatoria"
    if (!form.fecha_fin)              e.fecha_fin       = "La fecha de término es obligatoria"
    else if (form.fecha_inicio && form.fecha_fin && form.fecha_inicio >= form.fecha_fin)
      e.fecha_fin = "La fecha de término debe ser posterior a la de inicio"
    if (!form.hora_entrada)           e.hora_entrada    = "El horario de entrada es obligatorio"
    if (!form.hora_salida)            e.hora_salida     = "El horario de salida es obligatorio"
    else if (form.hora_entrada && form.hora_entrada >= form.hora_salida)
      e.hora_salida = "La hora de salida debe ser posterior a la de entrada"
    if (!form.actividades.trim())     e.actividades     = "La descripción de actividades es obligatoria"
    return e
  }

  function handleGuardar() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setGuardado(true)
  }

  async function handleGenerar(tipo) {
    setErrorGeneracion("")
    setGenerando(tipo)
    try {
      let blob, nombre
      if (tipo === "reporte") {
        blob   = await documentosApi.generarReporteFinal(form)
        nombre = `ReporteFinal_${user?.student_id || "alumno"}.pdf`
      } else {
        blob   = await documentosApi.generarControlHoras(form)
        nombre = `ControlHoras_${user?.student_id || "alumno"}.pdf`
      }
      descargarBlob(blob, nombre)
    } catch (err) {
      setErrorGeneracion(err.message)
    } finally {
      setGenerando(null)
    }
  }

  return (
    <>
      <h2 className="text-3xl font-bold mb-6">Generar Reportes</h2>
      <div className="flex flex-col items-center gap-6">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow p-8">
          <h3 className="text-2xl text-center font-bold mb-2">Formulario de Generación de Documentos</h3>
          <p className="text-gray-500 text-sm mb-6">
            Completa la información para generar tus documentos con tus datos prellenados.
          </p>

          <span className="inline-block text-white bg-[#18AD8F] px-4 py-1 rounded-full mb-4">
            <h4 className="font-bold">Información personal</h4>
          </span>
          <Input label="Teléfono:" type="tel" placeholder="Ejemplo: 6561234567"
            value={form.telefono} onChange={set("telefono")} error={errors.telefono} />

          <span className="inline-block text-white bg-[#18AD8F] px-4 py-1 rounded-full mb-4 mt-2">
            <h4 className="font-bold">Información del área de servicio social</h4>
          </span>
          <Input label="Nombre de la institución receptora:" placeholder="Ingrese el nombre de la institución"
            value={form.institucion} onChange={set("institucion")} error={errors.institucion} />
          <Input label="Dirección:" placeholder="Dirección de la institución"
            value={form.direccion} onChange={set("direccion")} error={errors.direccion} />
          <Input label="Teléfono de la institución:" type="tel" placeholder="Ejemplo: 6561234567"
            value={form.tel_institucion} onChange={set("tel_institucion")} error={errors.tel_institucion} />
          <Input label="Supervisor a cargo:" placeholder="Nombre del supervisor/encargado"
            value={form.supervisor} onChange={set("supervisor")} error={errors.supervisor} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <Input label="Fecha de inicio:" type="date" value={form.fecha_inicio}
              onChange={set("fecha_inicio")} error={errors.fecha_inicio} />
            <Input label="Fecha de término:" type="date" value={form.fecha_fin}
              onChange={set("fecha_fin")} error={errors.fecha_fin} />
          </div>
          <Input label="Programa educativo:" placeholder="Nombre del programa"
            value={form.programa} onChange={set("programa")} error={errors.programa} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <Input label="Horario de entrada:" type="time" value={form.hora_entrada}
              onChange={set("hora_entrada")} error={errors.hora_entrada} />
            <Input label="Horario de salida:" type="time" value={form.hora_salida}
              onChange={set("hora_salida")} error={errors.hora_salida} />
          </div>

          <span className="inline-block text-white bg-[#18AD8F] px-4 py-1 rounded-full mb-4 mt-2">
            <h4 className="font-bold">Descripción de actividades</h4>
          </span>
          <p className="text-gray-500 text-sm mb-3">
            De manera objetiva, explique las actividades más relevantes que realizó durante su Servicio Social:
          </p>
          <TextArea label="Actividades realizadas:" value={form.actividades}
            onChange={set("actividades")} error={errors.actividades} />

          {guardado && (
            <p className="text-green-600 text-sm text-center mb-4 font-semibold">
              ✓ Información guardada — puedes generar tus documentos
            </p>
          )}

          {!guardado && (
            <div className="flex justify-center mt-4">
              <button onClick={handleGuardar}
                className="bg-[#06B800] font-bold text-white px-6 py-2 rounded-full hover:bg-green-800 hover:scale-105 transition">
                Guardar información
              </button>
            </div>
          )}
        </div>

        {/* Documentos a generar */}
        <div className="w-full max-w-2xl flex flex-col gap-4">
          <h3 className="text-xl font-bold text-gray-700">Documentos a generar:</h3>

          {[
            { key: "control", label: "Registro de Control de Horas de Servicio Social" },
            { key: "reporte", label: "Reporte Final de Actividades" },
          ].map(({ key, label }) => (
            <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl shadow border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#18AD8F]/10 text-[#18AD8F] flex items-center justify-center shrink-0">
                  <FaFileLines size={20} />
                </div>
                <span className="font-semibold text-gray-700">{label}</span>
              </div>
              <button onClick={() => handleGenerar(key)} disabled={!guardado || generando === key}
                className={`flex items-center gap-2 w-full sm:w-auto font-bold text-white px-6 py-2 rounded-full transition
                  ${guardado ? "bg-[#168A5E] hover:bg-emerald-800 hover:scale-105" : "bg-gray-300 cursor-not-allowed"}`}>
                <FaDownload size={14} />
                {generando === key ? "Generando..." : "Generar PDF"}
              </button>
            </div>
          ))}

          {errorGeneracion && (
            <p className="text-red-500 text-sm text-center">{errorGeneracion}</p>
          )}
        </div>
      </div>
    </>
  )
}

export default Reportes
