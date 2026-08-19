import { useState } from "react"
import { useOutletContext } from "react-router-dom"
import Input from "../../components/Input"
import TextArea from "../../components/TextArea"
import { FaFileLines, FaDownload, FaChevronDown, FaChevronUp } from "react-icons/fa6"
import { documentosApi, descargarBlob } from "../../services/api"

function calcularHorasDia(entrada, salida) {
  if (!entrada || !salida) return 0
  const [he, me] = entrada.split(":").map(Number)
  const [hs, ms] = salida.split(":").map(Number)
  const diff = (hs * 60 + ms) - (he * 60 + me)
  return Math.max(0, Math.round(diff / 60 * 10) / 10)
}

function Reportes() {
  const { user } = useOutletContext() || {}

  const [form, setForm] = useState({
    telefono: "", institucion: "", direccion: "",
    tel_institucion: "", supervisor: "", programa: "",
    fecha_inicio: "", fecha_fin: "",
    hora_entrada: "", hora_salida: "",
    actividades: "",
  })
  const [filas, setFilas]           = useState(
    Array.from({ length: 25 }, () => ({ fecha: "", hora_entrada: "", hora_salida: "", horas_dia: 0 }))
  )
  const [tablaAbierta, setTablaAbierta] = useState(false)
  const [errors, setErrors]             = useState({})
  const [guardado, setGuardado]         = useState(false)
  const [generando, setGenerando]       = useState(null)
  const [errorGeneracion, setErrorGeneracion] = useState("")

  const set = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
    if (errors[field]) setErrors({ ...errors, [field]: "" })
  }

  // Horas acumuladas de la tabla
  const horasAcumuladas = Math.min(48, filas.reduce((acc, f) => acc + calcularHorasDia(f.hora_entrada, f.hora_salida), 0))
  const diasRegistrados = filas.filter(f => f.fecha && f.hora_entrada && f.hora_salida).length

  const acumuladoPorFila = filas.reduce((acc, fila, i) => {
    const h    = calcularHorasDia(fila.hora_entrada, fila.hora_salida)
    const prev = acc[i - 1] ?? 0
    acc[i]     = Math.min(48, prev + h)
    return acc
  }, [])

  function actualizarFila(i, campo, valor) {
    setFilas(prev => {
      const nuevas = [...prev]
      nuevas[i] = { ...nuevas[i], [campo]: valor }
      if (campo === "hora_entrada" || campo === "hora_salida") {
        const entrada = campo === "hora_entrada" ? valor : nuevas[i].hora_entrada
        const salida  = campo === "hora_salida"  ? valor : nuevas[i].hora_salida
        nuevas[i].horas_dia = calcularHorasDia(entrada, salida)
      }
      return nuevas
    })
  }

  function validate() {
    const e = {}
    if (!form.telefono.trim())    e.telefono    = "El teléfono es obligatorio"
    else if (!/^\d{10}$/.test(form.telefono)) e.telefono = "Debe tener 10 dígitos"
    if (!form.institucion.trim()) e.institucion = "La institución es obligatoria"
    if (!form.supervisor.trim())  e.supervisor  = "El supervisor es obligatorio"
    if (!form.fecha_inicio)       e.fecha_inicio = "La fecha de inicio es obligatoria"
    if (!form.fecha_fin)          e.fecha_fin    = "La fecha de término es obligatoria"
    if (!form.hora_entrada)       e.hora_entrada = "El horario de entrada es obligatorio"
    if (!form.hora_salida)        e.hora_salida  = "El horario de salida es obligatorio"
    if (!form.actividades.trim()) e.actividades  = "La descripción de actividades es obligatoria"
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
      const asistencias = filas
        .filter(f => f.fecha && f.hora_entrada && f.hora_salida)
        .map((f, idx) => ({
          fecha:            f.fecha,
          hora_entrada:     f.hora_entrada,
          hora_salida:      f.hora_salida,
          horas_dia:        f.horas_dia,
          horas_acumuladas: acumuladoPorFila[filas.indexOf(f)],
        }))

      const payload = { ...form, asistencias, horas_acumuladas_total: horasAcumuladas }

      let blob, nombre
      if (tipo === "control") {
        blob   = await documentosApi.generarControlHoras(payload)
        nombre = `ControlHoras_${user?.student_id || "alumno"}.pdf`
      } else {
        blob   = await documentosApi.generarReporteFinal(payload)
        nombre = `ReporteFinal_${user?.student_id || "alumno"}.pdf`
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
          <Input label="Nombre de la institución receptora:" placeholder="Nombre de la institución"
            value={form.institucion} onChange={set("institucion")} error={errors.institucion} />
          <Input label="Dirección:" placeholder="Dirección de la institución"
            value={form.direccion} onChange={set("direccion")} />
          <Input label="Teléfono de la institución:" type="tel" placeholder="Ejemplo: 6561234567"
            value={form.tel_institucion} onChange={set("tel_institucion")} />
          <Input label="Supervisor a cargo:" placeholder="Nombre del supervisor/encargado"
            value={form.supervisor} onChange={set("supervisor")} error={errors.supervisor} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <Input label="Fecha de inicio:" type="date" value={form.fecha_inicio}
              onChange={set("fecha_inicio")} error={errors.fecha_inicio} />
            <Input label="Fecha de término:" type="date" value={form.fecha_fin}
              onChange={set("fecha_fin")} error={errors.fecha_fin} />
          </div>
          <Input label="Programa educativo:" placeholder="Nombre del programa"
            value={form.programa} onChange={set("programa")} />
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

          {/* Sección colapsable de registro diario */}
          <div className="mt-6 border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setTablaAbierta(!tablaAbierta)}
              className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 hover:bg-gray-100 transition text-left">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-700">Registro de asistencias por día</span>
                {diasRegistrados > 0 && (
                  <span className="text-xs bg-[#18AD8F] text-white px-2 py-0.5 rounded-full">
                    {diasRegistrados} días · {horasAcumuladas}h acumuladas
                  </span>
                )}
              </div>
              {tablaAbierta ? <FaChevronUp size={14} className="text-gray-400" /> : <FaChevronDown size={14} className="text-gray-400" />}
            </button>

            {tablaAbierta && (
              <div className="p-4">
                <p className="text-xs text-gray-400 mb-3">
                  Opcional — registra tus días de asistencia para el control de horas. Máximo 48h.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#18AD8F] text-white">
                        <th className="p-2 text-left">#</th>
                        <th className="p-2 text-left">Fecha</th>
                        <th className="p-2 text-left">Entrada</th>
                        <th className="p-2 text-left">Salida</th>
                        <th className="p-2 text-center">Hrs/día</th>
                        <th className="p-2 text-center">Acumuladas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filas.map((fila, i) => {
                        const maxAlcanzado = i > 0 && acumuladoPorFila[i - 1] >= 48
                        return (
                          <tr key={i} className={`border-b border-gray-100 ${maxAlcanzado ? "opacity-40" : "hover:bg-gray-50"}`}>
                            <td className="p-1.5 text-gray-400">{i + 1}</td>
                            <td className="p-1.5">
                              <input type="date" disabled={maxAlcanzado} value={fila.fecha}
                                onChange={(e) => actualizarFila(i, "fecha", e.target.value)}
                                className="border border-gray-200 rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-[#18AD8F] disabled:bg-gray-100 text-xs" />
                            </td>
                            <td className="p-1.5">
                              <input type="time" disabled={maxAlcanzado} value={fila.hora_entrada}
                                onChange={(e) => actualizarFila(i, "hora_entrada", e.target.value)}
                                className="border border-gray-200 rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-[#18AD8F] disabled:bg-gray-100 text-xs" />
                            </td>
                            <td className="p-1.5">
                              <input type="time" disabled={maxAlcanzado} value={fila.hora_salida}
                                onChange={(e) => actualizarFila(i, "hora_salida", e.target.value)}
                                className="border border-gray-200 rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-[#18AD8F] disabled:bg-gray-100 text-xs" />
                            </td>
                            <td className="p-1.5 text-center font-semibold text-[#18AD8F]">
                              {fila.horas_dia > 0 ? `${fila.horas_dia}h` : "—"}
                            </td>
                            <td className="p-1.5 text-center font-bold text-[#1A3A5C]">
                              {acumuladoPorFila[i] > 0 ? `${acumuladoPorFila[i]}h` : "—"}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-[#1A3A5C] text-white">
                        <td colSpan={4} className="p-2 font-bold text-right text-xs">Total:</td>
                        <td colSpan={2} className="p-2 text-center font-bold">{horasAcumuladas}h / 48h</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                {horasAcumuladas >= 48 && (
                  <p className="text-green-600 text-xs font-semibold mt-2 text-center">
                    ✓ ¡Has completado tus 48 horas de servicio social!
                  </p>
                )}
              </div>
            )}
          </div>

          {guardado && (
            <p className="text-green-600 text-sm text-center mb-4 mt-4 font-semibold">
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

        {/* Documentos */}
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
          {errorGeneracion && <p className="text-red-500 text-sm text-center">{errorGeneracion}</p>}
        </div>
      </div>
    </>
  )
}

export default Reportes