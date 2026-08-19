import { useState, useEffect } from "react"
import { FaStamp, FaFileLines, FaFileCircleCheck, FaCheck, FaFlask } from "react-icons/fa6"
import { actividadesApi, documentosApi, descargarBlob } from "../../services/api"

// ── Ejemplo de prueba — quitar antes de producción ────────────────────────────
const EJEMPLO_PRUEBA = {
  student_id:        "25310205",
  first_name:        "Michelle",
  paternal_surname:  "Enriquez",
  accumulated_hours: 48,
  cuatrimestre:      3,
  actividad:         "Adopta a un Perro",
}
// ─────────────────────────────────────────────────────────────────────────────
const EJEMPLO_PRUEBA_1ER = {
  student_id:        "25310157",
  first_name:        "Leslie Margarita",
  paternal_surname:  "Aranda",
  accumulated_hours: 48,
  cuatrimestre:      1,
  actividad:         "Adopta a un Perro",
}

function Sellos() {
  const [alumnos, setAlumnos]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [sellados, setSellados]   = useState({})
  const [generando, setGenerando] = useState(null)
  const [error, setError]         = useState("")

  useEffect(() => {
    actividadesApi.getAll()
      .then(async (actividades) => {
        const todos = []
        for (const act of actividades) {
          try {
            const students = await actividadesApi.getStudents(act.id)
            students.forEach(s => {
              if (!todos.find(a => a.student_id === s.student_id))
                todos.push({ ...s, actividad: act.nombre })
            })
          } catch {}
        }
        setAlumnos(todos.filter(a => a.accumulated_hours >= 48))
      })
      .catch(() => setError("No se pudieron cargar los alumnos"))
      .finally(() => setLoading(false))
  }, [])

  const aplicarSello = (studentId) =>
    setSellados(prev => ({ ...prev, [studentId]: true }))

  const generar = async (tipo, studentId) => {
    setGenerando(`${tipo}-${studentId}`)
    setError("")
    try {
      const blob   = tipo === "constancia"
        ? await documentosApi.generarConstancia(studentId, true)
        : await documentosApi.generarBoleta(studentId, true)
      const nombre = tipo === "constancia"
        ? `Constancia_${studentId}.pdf`
        : `Boleta_${studentId}.pdf`
      descargarBlob(blob, nombre)
    } catch (err) {
      setError(err.message)
    } finally {
      setGenerando(null)
    }
  }

  const renderTarjeta = (a, esEjemplo = false) => {
    const sellado      = sellados[a.student_id]
    const primerCuatri = a.cuatrimestre === 1

    return (
      <div key={a.student_id}
        className={`bg-white rounded-xl shadow p-6 ${esEjemplo ? "border-2 border-dashed border-amber-300" : ""}`}>

        {esEjemplo && (
          <div className="flex items-center gap-2 mb-3 text-amber-600 text-xs font-semibold">
            <FaFlask size={12} /> Ejemplo de prueba — quitar antes de producción
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <p className="font-bold text-gray-800">{a.first_name} {a.paternal_surname}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {a.student_id} · {a.actividad} · {a.cuatrimestre}° cuatrimestre
            </p>
            {primerCuatri && (
              <p className="text-xs text-amber-600 mt-1 font-medium">
                ⚠️ Alumno de 1er cuatrimestre — las 48 hrs son obligatorias para avanzar
              </p>
            )}
            {!sellado && (
              <p className="text-xs text-yellow-600 mt-1">
                Aplica el sello antes de generar documentos
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {primerCuatri ? (
              <>
                <button onClick={() => generar("constancia", a.student_id)}
                  disabled={!sellado || generando === `constancia-${a.student_id}`}
                  className="flex items-center gap-2 bg-[#18AD8F] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#149B80] transition disabled:opacity-40 disabled:cursor-not-allowed">
                  <FaFileLines size={13} />
                  {generando === `constancia-${a.student_id}` ? "Generando..." : "Constancia 1° cuatri"}
                </button>
                <button onClick={() => generar("boleta", a.student_id)}
                  disabled={!sellado || generando === `boleta-${a.student_id}`}
                  className="flex items-center gap-2 bg-[#18AD8F] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#149B80] transition disabled:opacity-40 disabled:cursor-not-allowed">
                  <FaFileCircleCheck size={13} />
                  {generando === `boleta-${a.student_id}` ? "Generando..." : "Boleta de liberación"}
                </button>
              </>
            ) : (
              <button onClick={() => generar("constancia", a.student_id)}
                disabled={!sellado || generando === `constancia-${a.student_id}`}
                className="flex items-center gap-2 bg-[#18AD8F] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#149B80] transition disabled:opacity-40 disabled:cursor-not-allowed">
                <FaFileLines size={13} />
                {generando === `constancia-${a.student_id}` ? "Generando..." : "Generar constancia"}
              </button>
            )}

            <button onClick={() => aplicarSello(a.student_id)} disabled={sellado}
              className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg transition
                ${sellado ? "bg-green-100 text-green-700 cursor-default" : "bg-[#1A3A5C] text-white hover:bg-[#122840]"}`}>
              {sellado ? <FaCheck size={13} /> : <FaStamp size={13} />}
              {sellado ? "Sello aplicado" : "Aplicar sello"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <h2 className="text-3xl font-bold mb-2">Aplicar Sellos</h2>
      <p className="text-gray-400 text-sm mb-6">
        Solo aparecen alumnos que han completado sus 48 horas.
        Aplica el sello antes de generar los documentos oficiales.
      </p>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-gray-400 text-center py-8">Cargando alumnos...</p>
      ) : alumnos.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-400 mb-6">
          No hay alumnos con 48 horas completadas aún.
        </div>
      ) : (
        <div className="flex flex-col gap-4 mb-6">
          {alumnos.map(a => renderTarjeta(a))}
        </div>
      )}

            {/* Ejemplos de prueba */}
      <div className="flex flex-col gap-4">
        {renderTarjeta(EJEMPLO_PRUEBA_1ER, true)}
        {renderTarjeta(EJEMPLO_PRUEBA, true)}
      </div>
    </>
  )
}

export default Sellos
