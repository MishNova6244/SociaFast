import {BrowserRouter, Routes, Route} from "react-router-dom"

import LoginAlumno from "./pages/LoginAlumno"
import RegistrarCorreo from "./pages/RegistrarCorreo"
import RegistroAlumno from "./pages/RegistroAlumno"
import RecuperarContrasena from "./pages/RecuperarContrasena"
import ActualizarContrasena from "./pages/ActualizarContrasena"
import DashboardAlumno from "./pages/DashboardAlumno"
import Home from "./pages/DashboardAlumno/Home"
import Horas from "./pages/dashboardAlumno/Horas"
import Evidencias from "./pages/dashboardAlumno/Evidencias"
import Reportes from "./pages/dashboardAlumno/Reportes"
import Historial from "./pages/dashboardAlumno/Historial"
import Actividades from "./pages/dashboardAlumno/Actividades"
import Perfil from "./pages/dashboardAlumno/Perfil"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginAlumno />} />
        <Route path="/registrarCorreo" element={<RegistrarCorreo/>} />
        <Route path="/registroAlumno" element={<RegistroAlumno />} />
        <Route path="/recuperarContrasena" element={<RecuperarContrasena/>} />
        <Route path="/actualizarContrasena" element={<ActualizarContrasena/>} />

        <Route path="/dashboardAlumno" element={<DashboardAlumno/>} >
          <Route index element={<Home/>} />
          <Route path="horas" element={<Horas/>} />
          <Route path="evidencias" element={<Evidencias/>} />
          <Route path="reportes" element={<Reportes/>} />
          <Route path="historial" element={<Historial/>} />
          <Route path="actividades" element={<Actividades/>} />
          <Route path="perfil" element={<Perfil/>} />
        </Route>  
      </Routes>
    </BrowserRouter>
  )
}

export default App