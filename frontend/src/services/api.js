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
    throw new Error("Sesion expirada. Por favor inicia sesion de nuevo.")
  }

  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || "Error del servidor")
  return data
}

export const authApi = {
  validarCorreo: (correo) =>
    request("/auth/validar-correo", { method: "POST", body: JSON.stringify({ correo }) }),

  register: (formData) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(formData) }),

  login: (correo, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ correo, password }) }, true),
}

export const usersApi = {
  getMe: () => request("/users/me"),

  updateHoras: (horas) =>
    request("/users/me/horas", { method: "PATCH", body: JSON.stringify({ horas }) }),
}