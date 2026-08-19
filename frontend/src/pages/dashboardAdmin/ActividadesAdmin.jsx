import { useState, useEffect, useMemo } from "react"
import { FaPlus, FaPen, FaToggleOn, FaToggleOff, FaXmark, FaMagnifyingGlass, FaLocationDot, FaUserTie, FaTrash } from "react-icons/fa6"
import { actividadesApi } from "../../services/api"

const TIPOS = [
  { value: "deporte",  label: "Deporte" },
  { value: "cultural", label: "Cultural" },
  { value: "programa", label: "Programa" },
]

const FORM_VACIO = {
  nombre: "", tipo: "deporte",
  lugar: "", horarios: [{ dia: "", hora: "" }],
  encargado: "", departamento: "",
}

function ActividadesAdmin() {
  const [actividades, setActividades]         = useState([])
  const [loading, setLoading]                 = useState(true)
  const [busqueda, setBusqueda]               = useState("")
  const [filtroTipo, setFiltroTipo]           = useState("")
  const [filtroEstado, setFiltroEstado]       = useState("")
  const [modalAbierto, setModalAbierto]       = useState(false)
  const [editandoId, setEditandoId]           = useState(null)
  const [form, setForm]                       = useState(FORM_VACIO)
  const [error, setError]                     = useState("")
  const [guardando, setGuardando]             = useState(false)
  const [confirmarDesactivar, setConfirmarDesactivar] = useState(null)

  useEffect(() => {
    actividadesApi.getAll()
      .then(setActividades)
      .catch(() => setError("No se pudieron cargar las actividades"))
      .finally(() => setLoading(false))
  }, [])

  const actividadesFiltradas = useMemo(() => actividades.filter(a =>
    a.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
    (filtroTipo ? a.tipo === filtroTipo : true) &&
    (filtroEstado ? (filtroEstado === "activa" ? a.activa : !a.activa) : true)
  ), [actividades, busqueda, filtroTipo, filtroEstado])

  const abrirCrear = () => { setEditandoId(null); setForm(FORM_VACIO); setError(""); setModalAbierto(true) }

  const abrirEditar = (act) => {
    setEditandoId(act.id)
    setForm({
      nombre: act.nombre, tipo: act.tipo,
      lugar: act.lugar || "", horarios: act.horarios?.length ? act.horarios : [{ dia: "", hora: "" }],
      encargado: act.encargado || "", departamento: act.departamento || "",
    })
    setError("")
    setModalAbierto(true)
  }

  const cerrarModal = () => { setModalAbierto(false); setError("") }

  const agregarHorario  = () => setForm(prev => ({ ...prev, horarios: [...prev.horarios, { dia: "", hora: "" }] }))
  const quitarHorario   = (i) => setForm(prev => ({ ...prev, horarios: prev.horarios.filter((_, j) => j !== i) }))
  const actualizarHorario = (i, campo, val) =>
    setForm(prev => ({ ...prev, horarios: prev.horarios.map((h, j) => j === i ? { ...h, [campo]: val } : h) }))

  const guardar = async () => {
    if (!form.nombre.trim()) return setError("El nombre es obligatorio")
    if (form.tipo === "programa") {
      if (!form.encargado.trim()) return setError("El encargado es obligatorio")
      if (!form.departamento.trim()) return setError("El departamento es obligatorio")
    } else {
      if (!form.lugar.trim()) return setError("El lugar es obligatorio")
      if (!form.horarios.some(h => h.dia && h.hora)) return setError("Agrega al menos un horario válido")
    }
    setError("")
    setGuardando(true)
    try {
      const payload = {
        ...form,
        horarios: form.horarios.filter(h => h.dia && h.hora),
      }
      if (editandoId) {
        const updated = await actividadesApi.update(editandoId, payload)
        setActividades(prev => prev.map(a => a.id === editandoId ? updated : a))
      } else {
        const created = await actividadesApi.create(payload)
        setActividades(prev => [...prev, created])
      }
      setModalAbierto(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  const toggleActiva = async (id) => {
    try {
      const updated = await actividadesApi.toggle(id)
      setActividades(prev => prev.map(a => a.id === id ? updated : a))
      setConfirmarDesactivar(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const pedirConfirmacion = (act) => {
    if (act.activa) setConfirmarDesactivar(act)
    else toggleActiva(act.id)
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-3xl font-bold">Actividades Extracurriculares y Programas</h2>
        <button onClick={abrirCrear}
          className="flex items-center gap-2 bg-[#18AD8F] hover:bg-[#149B80] text-white px-4 py-2 rounded-lg transition">
          <FaPlus size={14} /> Agregar actividad
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
            <FaMagnifyingGlass size={14} className="text-gray-400" />
            <input type="text" placeholder="Buscar por nombre..." value={busqueda}
              onChange={e => setBusqueda(e.target.value)} className="flex-1 outline-none text-sm" />
          </div>
          <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#18AD8F]">
            <option value="">Todos los tipos</option>
            {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#18AD8F]">
            <option value="">Todos los estados</option>
            <option value="activa">Activas</option>
            <option value="inactiva">Inactivas</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow p-6">
        {loading ? <p className="text-center text-gray-400 py-8">Cargando...</p> : (
          <div className="overflow-x-auto w-full">
            <table className="min-w-[700px] w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-gray-400 font-medium pb-3">Nombre</th>
                  <th className="text-left text-gray-400 font-medium pb-3">Tipo</th>
                  <th className="text-left text-gray-400 font-medium pb-3">Detalle</th>
                  <th className="text-center text-gray-400 font-medium pb-3">Estado</th>
                  <th className="text-center text-gray-400 font-medium pb-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {actividadesFiltradas.map(act => (
                  <tr key={act.id} className={`transition ${act.activa ? "hover:bg-gray-50" : "bg-gray-50/50 opacity-60"}`}>
                    <td className="py-3 font-semibold text-gray-700">{act.nombre}</td>
                    <td className="py-3 text-gray-500 capitalize">{act.tipo}</td>
                    <td className="py-3 text-gray-500">
                      {act.tipo === "programa"
                        ? <span className="flex items-center gap-1"><FaUserTie size={11} />{act.encargado}</span>
                        : <span className="flex items-center gap-1"><FaLocationDot size={11} />{act.lugar}</span>
                      }
                    </td>
                    <td className="py-3 text-center">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${act.activa ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"}`}>
                        {act.activa ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => abrirEditar(act)} className="text-gray-400 hover:text-[#18AD8F] transition">
                          <FaPen size={14} />
                        </button>
                        <button onClick={() => pedirConfirmacion(act)}
                          className={act.activa ? "text-green-500 hover:text-gray-400 transition" : "text-gray-400 hover:text-green-500 transition"}>
                          {act.activa ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {actividadesFiltradas.length === 0 && (
                  <tr><td colSpan={5} className="py-6 text-center text-gray-400">Sin resultados</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Crear/Editar */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative max-h-[85vh] overflow-y-auto">
            <button onClick={cerrarModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <FaXmark size={20} />
            </button>
            <h3 className="text-xl font-bold mb-4">{editandoId ? "Editar actividad" : "Nueva actividad"}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Nombre</label>
                <input type="text" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#18AD8F]" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Tipo</label>
                <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}
                  disabled={!!editandoId}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#18AD8F] disabled:bg-gray-100">
                  {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              {form.tipo === "programa" ? (
                <>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Encargado</label>
                    <input type="text" value={form.encargado} onChange={e => setForm({ ...form, encargado: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#18AD8F]" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Departamento</label>
                    <input type="text" value={form.departamento} onChange={e => setForm({ ...form, departamento: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#18AD8F]" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Lugar</label>
                    <input type="text" value={form.lugar} onChange={e => setForm({ ...form, lugar: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#18AD8F]" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Horarios</label>
                    <div className="space-y-2">
                      {form.horarios.map((h, i) => (
                        <div key={i} className="flex gap-2">
                          <input type="text" placeholder="Día" value={h.dia}
                            onChange={e => actualizarHorario(i, "dia", e.target.value)}
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#18AD8F]" />
                          <input type="text" placeholder="Hora" value={h.hora}
                            onChange={e => actualizarHorario(i, "hora", e.target.value)}
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#18AD8F]" />
                          {form.horarios.length > 1 && (
                            <button onClick={() => quitarHorario(i)} className="text-red-400 hover:text-red-600">
                              <FaTrash size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button onClick={agregarHorario} className="text-xs text-[#18AD8F] font-semibold hover:underline mt-2">
                      + Agregar horario
                    </button>
                  </div>
                </>
              )}
              {error && <p className="text-red-500 text-xs">{error}</p>}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={cerrarModal}
                className="border border-gray-300 text-gray-600 font-semibold px-4 py-2 rounded-lg hover:bg-gray-100 transition">
                Cancelar
              </button>
              <button onClick={guardar} disabled={guardando}
                className="bg-[#18AD8F] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#149B80] transition disabled:opacity-50">
                {guardando ? "Guardando..." : editandoId ? "Guardar cambios" : "Crear actividad"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmación desactivar */}
      {confirmarDesactivar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Desactivar actividad</h3>
            <p className="text-gray-500 text-sm mb-6">
              ¿Seguro que quieres desactivar <strong>{confirmarDesactivar.nombre}</strong>? Ya no aparecerá para nuevos alumnos.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmarDesactivar(null)}
                className="flex-1 border border-gray-300 text-gray-600 font-semibold py-2 rounded-lg hover:bg-gray-100 transition">
                Cancelar
              </button>
              <button onClick={() => toggleActiva(confirmarDesactivar.id)}
                className="flex-1 bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition">
                Desactivar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ActividadesAdmin
