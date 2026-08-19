import { useState } from "react"
import Input from "./Input"
import TextArea from "./TextArea"
import { FaXmark, FaCheck, FaMedal } from "react-icons/fa6"
import { documentosApi, descargarBlob } from "../services/api"

const FORM_VACIO = {
  fecha: new Date().toISOString().split("T")[0],
  institucion: "", direccion: "", tel_institucion: "", supervisor: "",
  dias_modalidad: "", cumple_horario: "", supervisa_entrada_salida: "",
  firma_horas_semanales: "", reporte_final: "",
  acato_reglamento: "", acato_reglamento_porque: "",
  labores_eficientes: "", labores_eficientes_porque: "",
  actividades_relevantes: "", nivel_relevancia: "",
  retribuye_formacion: "", calificacion: "", calificacion_porque: "",
}

function RadioGroup({ nombre, label, opciones, valor, onChange }) {
  return (
    <div className="mb-4">
      {label && <label className="block mb-2 font-medium text-sm">{label}</label>}
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {opciones.map(op => (
          <label key={op.value} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="radio" name={nombre} value={op.value}
              checked={valor === op.value} onChange={() => onChange(op.value)}
              className="w-4 h-4 accent-[#18AD8F] cursor-pointer" />
            {op.label}
          </label>
        ))}
      </div>
    </div>
  )
}

function ModalFormularioDesempeno({ alumno, onClose, onGuardado }) {
  const [form, setForm]         = useState(FORM_VACIO)
  const [guardando, setGuardando] = useState(false)
  const [error, setError]       = useState("")

  if (!alumno) return null

  const set      = (campo) => (valor) => setForm(prev => ({ ...prev, [campo]: valor }))
  const setInput = (campo) => (e)    => setForm(prev => ({ ...prev, [campo]: e.target.value }))

  function validate() {
    const requeridos = [
      "institucion", "supervisor", "dias_modalidad", "cumple_horario",
      "supervisa_entrada_salida", "firma_horas_semanales", "reporte_final",
      "acato_reglamento", "labores_eficientes", "actividades_relevantes",
      "nivel_relevancia", "retribuye_formacion", "calificacion",
    ]
    for (const campo of requeridos) {
      if (!form[campo]) return `Falta completar: ${campo.replaceAll("_", " ")}`
    }
    if (form.tel_institucion && !/^\d{10}$/.test(form.tel_institucion))
      return "El teléfono de la institución debe tener 10 dígitos"
    return null
  }

  async function handleGuardar() {
    const errorValidacion = validate()
    if (errorValidacion) return setError(errorValidacion)

    setGuardando(true)
    setError("")
    try {
      const blob = await documentosApi.generarEvaluacion(alumno.matricula, form)
      descargarBlob(blob, `Evaluacion_${alumno.matricula}.pdf`)
      onGuardado?.({ ...form, nombre_alumno: alumno.nombre, matricula: alumno.matricula })
      onClose()
    } catch (err) {
      setError(err.message || "No se pudo generar la evaluación del alumno")
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl relative max-h-[90vh] flex flex-col">

        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <FaMedal size={18} className="text-[#18AD8F]" />
            <h3 className="text-xl font-semibold">Evaluación de desempeño</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <FaXmark size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1">
          {/* Datos del alumno — solo lectura */}
          <div className="bg-gray-50 rounded-lg p-4 mb-5 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <p className="text-sm"><span className="text-gray-400">Alumno:</span> <span className="font-semibold">{alumno.nombre}</span></p>
            <p className="text-sm"><span className="text-gray-400">Matrícula:</span> <span className="font-semibold">{alumno.matricula}</span></p>
            <p className="text-sm"><span className="text-gray-400">Carrera:</span> <span className="font-semibold">{alumno.carrera}</span></p>
          </div>

          <span className="inline-block text-white bg-[#18AD8F] px-4 py-1 rounded-lg mb-3">
            <h2 className="font-bold">Datos generales</h2>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <Input label="Fecha de evaluación:" type="date" value={form.fecha} onChange={setInput("fecha")} />
            <Input label="Nombre de la institución:" value={form.institucion} placeholder="Nombre de la institución" onChange={setInput("institucion")} />
            <Input label="Dirección:" value={form.direccion} placeholder="Dirección de la institución" onChange={setInput("direccion")} />
            <Input label="Teléfono de la institución:" type="tel" value={form.tel_institucion} placeholder="10 dígitos" onChange={setInput("tel_institucion")} />
            <Input label="Supervisor a cargo:" value={form.supervisor} placeholder="Su nombre" onChange={setInput("supervisor")} />
          </div>

          <hr className="my-5 border-gray-100" />
          <span className="inline-block text-white bg-[#18AD8F] px-4 py-1 rounded-lg mb-3">
            <h2 className="font-bold">I. Asistencia y Puntualidad</h2>
          </span>

          <TextArea label="1.- ¿Cuántos días asiste a la semana y en qué modalidad?" rows={2}
            value={form.dias_modalidad} onChange={setInput("dias_modalidad")} />

          <RadioGroup label="2.- ¿El alumno cumple con el horario establecido?" nombre="cumple_horario"
            opciones={[{ value: "siempre", label: "Siempre" }, { value: "algunas_veces", label: "Algunas veces" }, { value: "nunca", label: "Nunca" }]}
            valor={form.cumple_horario} onChange={set("cumple_horario")} />

          <RadioGroup label="3.- ¿La institución supervisa la hora de entrada y salida?" nombre="supervisa_entrada_salida"
            opciones={[{ value: "si", label: "Sí" }, { value: "no", label: "No" }]}
            valor={form.supervisa_entrada_salida} onChange={set("supervisa_entrada_salida")} />

          <RadioGroup label="4.- ¿El alumno consultó con usted para firmar las horas semanales?" nombre="firma_horas_semanales"
            opciones={[{ value: "si", label: "Sí" }, { value: "no", label: "No" }]}
            valor={form.firma_horas_semanales} onChange={set("firma_horas_semanales")} />

          <RadioGroup label="5.- ¿El alumno realizó un reporte final?" nombre="reporte_final"
            opciones={[{ value: "si", label: "Sí" }, { value: "no", label: "No" }]}
            valor={form.reporte_final} onChange={set("reporte_final")} />

          <hr className="my-5 border-gray-100" />
          <span className="inline-block text-white bg-[#18AD8F] px-4 py-1 rounded-lg mb-3">
            <h2 className="font-bold">II. Responsabilidad y Desempeño</h2>
          </span>

          <RadioGroup label="6.- ¿El alumno acató el reglamento de la institución?" nombre="acato_reglamento"
            opciones={[{ value: "si", label: "Sí" }, { value: "no", label: "No" }]}
            valor={form.acato_reglamento} onChange={set("acato_reglamento")} />
          <TextArea label="¿Por qué?" rows={2} value={form.acato_reglamento_porque} onChange={setInput("acato_reglamento_porque")} />

          <RadioGroup label="7.- ¿El alumno realiza las labores eficientemente?" nombre="labores_eficientes"
            opciones={[{ value: "si", label: "Sí" }, { value: "no", label: "No" }]}
            valor={form.labores_eficientes} onChange={set("labores_eficientes")} />
          <TextArea label="¿Por qué?" rows={2} value={form.labores_eficientes_porque} onChange={setInput("labores_eficientes_porque")} />

          <hr className="my-5 border-gray-100" />
          <span className="inline-block text-white bg-[#18AD8F] px-4 py-1 rounded-lg mb-3">
            <h2 className="font-bold">III. Pertinencia y Formación Integral</h2>
          </span>

          <TextArea label="8.- Mencione las actividades relevantes que realiza el estudiante:" rows={2}
            value={form.actividades_relevantes} onChange={setInput("actividades_relevantes")} />

          <RadioGroup label="9.- ¿Cómo considera las actividades del estudiante para su departamento?" nombre="nivel_relevancia"
            opciones={[{ value: "relevantes", label: "Relevantes" }, { value: "poco_relevantes", label: "Poco relevantes" }, { value: "nada_relevantes", label: "Nada relevantes" }]}
            valor={form.nivel_relevancia} onChange={set("nivel_relevancia")} />

          <RadioGroup label="10.- ¿Las actividades retribuyen en la formación del estudiante?" nombre="retribuye_formacion"
            opciones={[{ value: "mucho", label: "Mucho" }, { value: "poco", label: "Poco" }, { value: "nada", label: "Nada" }]}
            valor={form.retribuye_formacion} onChange={set("retribuye_formacion")} />

          <RadioGroup label="11.- ¿Qué calificación del 1 al 5 le asigna al prestador?" nombre="calificacion"
            opciones={[
              { value: "1", label: "1 - Deficiente" }, { value: "2", label: "2 - Malo" },
              { value: "3", label: "3 - Regular" },    { value: "4", label: "4 - Bueno" },
              { value: "5", label: "5 - Excelente" },
            ]}
            valor={form.calificacion} onChange={set("calificacion")} />
          <TextArea label="¿Por qué?" rows={2} value={form.calificacion_porque} onChange={setInput("calificacion_porque")} />

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
          <button onClick={onClose} disabled={guardando}
            className="border border-gray-300 text-gray-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition disabled:opacity-50">
            Cancelar
          </button>
          <button onClick={handleGuardar} disabled={guardando}
            className="flex items-center gap-2 bg-[#18AD8F] text-white font-semibold px-5 py-2 rounded-lg hover:bg-[#149B80] transition disabled:opacity-50">
            <FaCheck size={14} /> {guardando ? "Generando PDF..." : "Guardar y generar PDF"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalFormularioDesempeno