import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login                from "./pages/Login"
import RegistrarCorreo      from "./pages/RegistrarCorreo"
import RegistroAlumno       from "./pages/RegistroAlumno"
import RegistroEncargado    from "./pages/RegistroEncargado"
import RegistroAdmin        from "./pages/RegistroAdmin"
import RecuperarContrasena  from "./pages/RecuperarContrasena"
import ActualizarContrasena from "./pages/ActualizarContrasena"
import ProtectedRoute       from "./components/ProtectedRoute"

// Dashboard Alumno
import DashboardAlumno  from "./pages/DashboardAlumno"
import Home             from "./pages/dashboardAlumno/Home"
import Horas            from "./pages/dashboardAlumno/Horas"
import Evidencias       from "./pages/dashboardAlumno/Evidencias"
import Reportes         from "./pages/dashboardAlumno/Reportes"
import Historial        from "./pages/dashboardAlumno/Historial"
import Actividades      from "./pages/dashboardAlumno/Actividades"
import Perfil           from "./pages/dashboardAlumno/Perfil"

// Dashboard Encargado
import DashboardEncargado     from "./pages/DashboardEncargado"
import Alumnos                from "./pages/dashboardEncargado/Alumnos"
import EvidenciasPendientes   from "./pages/dashboardEncargado/EvidenciasPendientes"
import ReportesFirmar         from "./pages/dashboardEncargado/ReportesFirmar"
import HistorialAprobaciones  from "./pages/dashboardEncargado/HistorialAprobaciones"
import DetectorIA             from "./pages/dashboardEncargado/DetectorIA"
import PerfilEncargado        from "./pages/dashboardEncargado/PerfilEncargado"
import AsistenciasEncargado   from "./pages/dashboardEncargado/AsistenciasEncargado"

// Dashboard Admin
import DashboardAdmin       from "./pages/DashboardAdmin"
import ReportesPendientes   from "./pages/dashboardAdmin/ReportesPendientes"
import Sellos               from "./pages/dashboardAdmin/Sellos"
import Comprobantes         from "./pages/dashboardAdmin/Comprobantes"
import Estadisticas         from "./pages/dashboardAdmin/Estadisticas"
import DetectorIAAdmin      from "./pages/dashboardAdmin/DetectorIAAdmin"
import PerfilAdmin          from "./pages/dashboardAdmin/PerfilAdmin"
import AsistenciasAdmin     from "./pages/dashboardAdmin/AsistenciasAdmin"
import ActividadesAdmin     from "./pages/dashboardAdmin/ActividadesAdmin"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/"                     element={<Login />} />
        <Route path="/registrarCorreo"      element={<RegistrarCorreo />} />
        <Route path="/registroAlumno"       element={<RegistroAlumno />} />
        <Route path="/registroEncargado"    element={<RegistroEncargado />} />
        <Route path="/registroAdmin"        element={<RegistroAdmin />} />
        <Route path="/recuperarContrasena"  element={<RecuperarContrasena />} />
        <Route path="/actualizarContrasena" element={<ActualizarContrasena />} />

        {/* Dashboard Alumno */}
        <Route path="/dashboardAlumno" element={
          <ProtectedRoute allowedRoles={["estudiante"]}>
            <DashboardAlumno />
          </ProtectedRoute>
        }>
          <Route index            element={<Home />} />
          <Route path="horas"       element={<Horas />} />
          <Route path="evidencias"  element={<Evidencias />} />
          <Route path="reportes"    element={<Reportes />} />
          <Route path="historial"   element={<Historial />} />
          <Route path="actividades" element={<Actividades />} />
          <Route path="perfil"      element={<Perfil />} />
        </Route>

        {/* Dashboard Encargado */}
        <Route path="/dashboardEncargado" element={
          <ProtectedRoute allowedRoles={["encargado"]}>
            <DashboardEncargado />
          </ProtectedRoute>
        }>
          <Route index               element={<Alumnos />} />
          <Route path="evidencias"   element={<EvidenciasPendientes />} />
          <Route path="reportes"     element={<ReportesFirmar />} />
          <Route path="historial"    element={<HistorialAprobaciones />} />
          <Route path="detector-ia"  element={<DetectorIA />} />
          <Route path="perfil"       element={<PerfilEncargado />} />
          <Route path="asistencias"  element={<AsistenciasEncargado />} />
        </Route>

        {/* Dashboard Admin */}
        <Route path="/dashboardAdmin" element={
          <ProtectedRoute allowedRoles={["administrador"]}>
            <DashboardAdmin />
          </ProtectedRoute>
        }>
          <Route index               element={<ReportesPendientes />} />
          <Route path="sellos"       element={<Sellos />} />
          <Route path="comprobantes" element={<Comprobantes />} />
          <Route path="estadisticas" element={<Estadisticas />} />
          <Route path="detector-ia"  element={<DetectorIAAdmin />} />
          <Route path="perfil"       element={<PerfilAdmin />} />
          <Route path="asistencias"  element={<AsistenciasAdmin/>} />
          <Route path="actividades"  element={<ActividadesAdmin/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
