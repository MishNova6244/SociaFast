const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"

function clearSession() {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  window.location.href = "/"
}

async function request(endpoint, options = {}, skipAuthRedirect = false) {
  const token = localStorage.getItem("token")
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  })
  if (res.status === 401 && !skipAuthRedirect) {
    clearSession()
    throw new Error("Sesión expirada. Por favor inicia sesión de nuevo.")
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.detail || "Error del servidor")
  }
  return res.json()
}

// Función unificada para descargar PDFs — evita duplicar código en cada método
async function fetchBlob(endpoint, options = {}) {
  const token = localStorage.getItem("token")
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}`, ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.detail || "Error al generar el documento")
  }
  return res.blob()
}

// ── Autenticación ─────────────────────────────────────────────────────────────
export const authApi = {
  validateEmail:      (email) =>
    request("/auth/validate-email", { method: "POST", body: JSON.stringify({ email }) }),
  register:           (formData) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(formData) }),
  registerSupervisor: (formData) =>
    request("/auth/register/supervisor", { method: "POST", body: JSON.stringify(formData) }),
  registerAdmin:      (formData) =>
    request("/auth/register/admin", { method: "POST", body: JSON.stringify(formData) }),
  login:              (email, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }, true),
  forgotPassword:     (email) =>
    request("/auth/password/forgot", { method: "POST", body: JSON.stringify({ email }) }),
  resetPassword:      ({ token, new_password, confirm_password }) =>
    request("/auth/password/reset", { method: "POST", body: JSON.stringify({ token, new_password, confirm_password }) }),
}

// ── Usuario ───────────────────────────────────────────────────────────────────
export const usersApi = {
  getMe:         () => request("/users/me"),
  updateHours:   (hours) =>
    request("/users/me/hours", { method: "PATCH", body: JSON.stringify({ hours }) }),
  updateProfile: (data) =>
    request("/users/me/profile", { method: "PATCH", body: JSON.stringify(data) }),
}

// ── Actividades ───────────────────────────────────────────────────────────────
export const actividadesApi = {
  getAll:            () => request("/activities"),
  getMyEnrollment:   () => request("/activities/my-enrollment"),
  enroll:            (actividad_id, periodo = null) =>
    request("/activities/enroll", { method: "POST", body: JSON.stringify({ actividad_id, periodo }) }),
  unenroll:          (actividad_id) =>
    request(`/activities/${actividad_id}/enroll`, { method: "DELETE" }),
  getStudents:       (actividad_id) => request(`/activities/${actividad_id}/students`),
  assignToSupervisor:(actividad_id) =>
    request("/activities/assign", { method: "PATCH", body: JSON.stringify({ actividad_id }) }),
  create:            (data) =>
    request("/activities", { method: "POST", body: JSON.stringify(data) }),
  update:            (id, data) =>
    request(`/activities/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  toggle:            (id) =>
    request(`/activities/${id}/toggle`, { method: "PATCH" }),
}

// ── Documentos ────────────────────────────────────────────────────────────────
export const documentosApi = {
  generarReporteFinal:  (form) =>
    fetchBlob("/docs/reporte-final", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }),
  generarControlHoras:  (form) =>
    fetchBlob("/docs/control-horas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }),
  generarEvaluacion:    (studentId, form) =>
    fetchBlob(`/docs/evaluacion/${studentId}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }),
  generarConstancia:    (studentId, conSello = true) =>
    fetchBlob(`/docs/constancia/${studentId}?con_sello=${conSello}`, { method: "POST" }),
  generarBoleta:        (studentId, conSello = true) =>
    fetchBlob(`/docs/boleta/${studentId}?con_sello=${conSello}`, { method: "POST" }),
}

// Descarga un blob como archivo
export function descargarBlob(blob, nombreArchivo) {
  const url = URL.createObjectURL(blob)
  const a   = document.createElement("a")
  a.href = url; a.download = nombreArchivo; a.click()
  URL.revokeObjectURL(url)
}
