const BASE_URL = "http://localhost:8000/api/v1"

// Helper central: todas las llamadas al backend pasan por aquí
async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token")

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      // Agrega el JWT si existe en localStorage
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  })

  const data = await res.json()

  // Si el backend responde con error, lo lanzamos para capturarlo en el componente
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

  login: (correo, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ correo, password }),
    }),
}

export const usersApi = {
  getMe: () => request("/users/me"),
}