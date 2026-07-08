import { Navigate } from "react-router-dom"

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token")

  // Si no hay token redirige al login sin mostrar la página
  if (!token) return <Navigate to="/" replace />

  return children
}

export default ProtectedRoute