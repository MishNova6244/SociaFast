import {BrowserRouter, Routes, Route} from "react-router"

import Login from "./pages/Login"
import Registro from "./pages/Registro"
import DashboardAlumno from "./pages/DashboardAlumno"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/dashAlumno" element={<DashboardAlumno/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App