import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login           from "./pages/Login"
import ValidacionCorreo from "./pages/ValidacionCorreo"
import RegistroAlumno  from "./pages/RegistroAlumno"
import DashboardAlumno from "./pages/DashboardAlumno"
import ProtectedRoute  from "./components/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/"              element={<Login />} />
        <Route path="/validarCorreo" element={<ValidacionCorreo />} />
        <Route path="/registroAlumno" element={<RegistroAlumno />} />

        {/* Rutas protegidas: redirigen al login si no hay token */}
        <Route path="/dashboardAlumno" element={
          <ProtectedRoute><DashboardAlumno /></ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App