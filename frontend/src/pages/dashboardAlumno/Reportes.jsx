import { useState } from "react"
import { useOutletContext } from "react-router-dom"
import Input from "../../components/Input"
import { FaFileLines, FaDownload } from "react-icons/fa6"
import { documentosApi, descargarBlob } from "../../services/api"

const FILA_VACIA = { fecha: "", hora_entrada: "", hora_salida: "", horas_dia: 0 }

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
  })
  const [filas, setFilas] = useState(
    Array.from({ length: 25 }, () => ({ ...FILA_VACIA }))
  )
  const [errors, setErrors]                   = useState({})
  const [guardado, setGuardado]               = useState(false)
  const [generando, setGenerando]             = useState(null)
  const [errorGeneracion, setErrorGeneracion] = useState("")

  const set = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
    if (errors[field]) setErrors({ ...errors, [field]: "" })
  }

  // Calcular horas acumuladas respetando el límite de 48
  const horasAcumuladas = filas.reduce((acc, fila, i) => {
    const h = calcularHorasDia(fila.hora_entrada, fila.hora_salida)
    const nuevo = acc + h
    return nuevo > 48 ? 48 : nuevo
  }, 0)

  function actualizarFila(i, campo, valor) {
    setFilas(prev => {
      const nuevas = [...prev]
      nuevas[i] = { ...nuevas[i], [campo]: valor }
      // Calcular horas del día automáticamente
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
    const filasLlenas = filas.filter(f => f.fecha || f.hora_entrada || f.hora_salida)
    if (filasLlenas.length === 0) e.filas = "Registra al menos un día de asistencia"
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
      // Construir tabla de asistencias para el PDF
      const asistencias = filas
        .filter(f => f.fecha && f.hora_entrada && f.hora_salida)
        .map((f, i) => {
          const acum = filas.slice(0, filas.indexOf(f) + 1).reduce((acc, ff) => {
            const h = calcularHorasDia(ff.hora_entrada, ff.hora_salida)
            return Math.min(48, acc + h)
          }, 0)
          return {
            fecha:           f.fecha,
            hora_entrada:    f.hora_entrada,
            hora_salida:     f.hora_salida,
            horas_dia:       f.horas_dia,
            horas_acumuladas: acum,
          }
        })

      const payload = {
        ...form,
        asistencias,
        horas_acumuladas_total: horasAcumuladas,
      }

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

  // Calcular acumulado por fila para mostrarlo
  const acumuladoPorFila = filas.reduce((acc, fila, i) => {
    const h    = calcularHorasDia(fila.hora_entrada, fila.hora_salida)
    const prev = acc[i - 1] ?? 0
    acc[i]     = Math.min(48, prev + h)
    return acc
  }, [])

  return (
    <>
      <h2 className="text-3xl font-bold mb-6">Generar Reportes</h2>
      <div className="flex flex-col items-center gap-6">
        <div className="w-full max-w-3xl bg-white rounded-xl shadow p-8">
          <h3 className="text-xl font-bold mb-4">Información general</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <Input label="Teléfono:" type="tel" placeholder="10 dígitos"
              value={form.telefono} onChange={set("telefono")} error={errors.telefono} />
            <Input label="Institución receptora:" placeholder="Nombre de la institución"
              value={form.institucion} onChange={set("institucion")} error={errors.institucion} />
            <Input label="Dirección:" placeholder="Dirección de la institución"
              value={form.direccion} onChange={set("direccion")} />
            <Input label="Teléfono institución:" type="tel" placeholder="10 dígitos"
              value={form.tel_institucion} onChange={set("tel_institucion")} />
            <Input label="Supervisor a cargo:" placeholder="Nombre del supervisor"
              value={form.supervisor} onChange={set("supervisor")} error={errors.supervisor} />
            <Input label="Programa educativo:" placeholder="Nombre del programa"
              value={form.programa} onChange={set("programa")} />
          </div>

          <h3 className="text-xl font-bold mt-6 mb-3">Registro de asistencias</h3>
          <p className="text-sm text-gray-400 mb-3">
            Registra tus días de asistencia. Máximo 48 horas acumuladas.
          </p>

          {errors.filas && <p className="text-red-500 text-sm mb-3">{errors.filas}</p>}

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
                    <tr key={i} className={`border-b border-gray-100 ${maxAlcanzado ? "bg-gray-50 opacity-50" : "hover:bg-gray-50"}`}>
                      <td className="p-1.5 text-gray-400">{i + 1}</td>
                      <td className="p-1.5">
                        <input type="date" disabled={maxAlcanzado}
                          value={fila.fecha}
                          onChange={(e) => actualizarFila(i, "fecha", e.target.value)}
                          className="border border-gray-200 rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-[#18AD8F] disabled:bg-gray-100" />
                      </td>
                      <td className="p-1.5">
                        <input type="time" disabled={maxAlcanzado}
                          value={fila.hora_entrada}
                          onChange={(e) => actualizarFila(i, "hora_entrada", e.target.value)}
                          className="border border-gray-200 rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-[#18AD8F] disabled:bg-gray-100" />
                      </td>
                      <td className="p-1.5">
                        <input type="time" disabled={maxAlcanzado}
                          value={fila.hora_salida}
                          onChange={(e) => actualizarFila(i, "hora_salida", e.target.value)}
                          className="border border-gray-200 rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-[#18AD8F] disabled:bg-gray-100" />
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
                  <td colSpan={4} className="p-2 font-bold text-right">Total acumulado:</td>
                  <td colSpan={2} className="p-2 text-center font-bold text-lg">{horasAcumuladas}h / 48h</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {horasAcumuladas >= 48 && (
            <p className="text-green-600 text-sm font-semibold mt-3 text-center">
              ✓ ¡Has completado tus 48 horas de servicio social!
            </p>
          )}

          {guardado && (
            <p className="text-green-600 text-sm text-center mt-4 font-semibold">
              ✓ Información guardada — puedes generar tus documentos
            </p>
          )}

          {!guardado && (
            <div className="flex justify-center mt-6">
              <button onClick={handleGuardar}
                className="bg-[#06B800] font-bold text-white px-6 py-2 rounded-full hover:bg-green-800 hover:scale-105 transition">
                Guardar información
              </button>
            </div>
          )}
        </div>

        {/* Documentos */}
        <div className="w-full max-w-3xl flex flex-col gap-4">
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