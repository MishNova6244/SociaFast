import { Navigate } from "react-router-dom"

// Cambiar a true para activar protección de rutas en producción
const PROTECCION_ACTIVA = true

function ProtectedRoute({ children, allowedRoles }) {
  if (!PROTECCION_ACTIVA) return children

  const token = localStorage.getItem("token")
  if (!token) return <Navigate to="/" replace />

  if (allowedRoles) {
    const user = JSON.parse(localStorage.getItem("user") || "null")
    if (!user || !allowedRoles.includes(user.role))
      return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
