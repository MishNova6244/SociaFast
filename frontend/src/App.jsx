import { BrowserRouter, Routes, Route } from "react-router-dom"

import LoginAlumno from "./pages/LoginAlumno"
import RegistrarCorreo from "./pages/RegistrarCorreo"
import RegistroAlumno from "./pages/RegistroAlumno"
import RecuperarContrasena from "./pages/RecuperarContrasena"
import ActualizarContrasena from "./pages/ActualizarContrasena"
import DashboardAlumno from "./pages/DashboardAlumno"
import Home from "./pages/dashboardAlumno/Home"
import Horas from "./pages/dashboardAlumno/Horas"
import Evidencias from "./pages/dashboardAlumno/Evidencias"
import Reportes from "./pages/dashboardAlumno/Reportes"
import Historial from "./pages/dashboardAlumno/Historial"
import Actividades from "./pages/dashboardAlumno/Actividades"
import Perfil from "./pages/dashboardAlumno/Perfil"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LoginAlumno />} />
        <Route path="/registrarCorreo" element={<RegistrarCorreo />} />
        <Route path="/registroAlumno" element={<RegistroAlumno />} />
        <Route path="/recuperarContrasena" element={<RecuperarContrasena />} />
        <Route path="/actualizarContrasena" element={<ActualizarContrasena />} />

        {/* Rutas protegidas */}
        <Route path="/dashboardAlumno" element={
          <ProtectedRoute><DashboardAlumno /></ProtectedRoute>
        }>
          <Route index element={<Home />} />
          <Route path="horas" element={<Horas />} />
          <Route path="evidencias" element={<Evidencias />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="historial" element={<Historial />} />
          <Route path="actividades" element={<Actividades />} />
          <Route path="perfil" element={<Perfil />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
