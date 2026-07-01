const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"

function clearSession() {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  window.location.href = "/"   // redirige al login en cualquier pantalla
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

  // Solo redirige al login si es 401 Y no es un endpoint público
  if (res.status === 401 && !skipAuthRedirect) {
    clearSession()
    throw new Error("Sesión expirada. Por favor inicia sesión de nuevo.")
  }

  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || "Error del servidor")
  return data
}

export const authApi = {
  validarCorreo: (correo) =>
    request("/auth/validar-correo", {
      method: "POST",
      body: JSON.stringify({ correo }),
    }),

  register: (formData) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(formData),
    }),

  // true = no redirigir si recibe 401, solo lanzar el error
  login: (correo, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ correo, password }),
    }, true),
}

export const usersApi = {
  getMe: () => request("/users/me"),
}