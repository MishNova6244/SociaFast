import {BrowserRouter, Routes, Route} from "react-router-dom"

import Login from "./pages/Login"
import ValidacionCorreo from "./pages/ValidacionCorreo"
import RegistroAlumno from "./pages/RegistroAlumno"
import DashboardAlumno from "./pages/DashboardAlumno"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/validarCorreo" element={<ValidacionCorreo/>} />
        <Route path="/registroAlumno" element={<RegistroAlumno />} />
        <Route path="/dashboardAlumno" element={<DashboardAlumno/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App