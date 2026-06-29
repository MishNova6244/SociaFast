import Layout from "../components/Layout"
import Input from "../components/Input"
import {Link} from "react-router-dom"

function Login(){
    return(
        <Layout>
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>

        <Input label="Correo institucional:" type="email" placeholder="ejemplo@utpn.edu.mx"></Input>

        <Input label="Contraseña:" type="password" placeholder="Ingrese su contraseña"></Input>

        <div className="flex justify-center">
        <Link to="/dashboardAlumno" className="bg-[#06B800] font-bold text-white px-6 py-2 rounded-full hover:bg-green-800 hover:scale-105 transition">Iniciar sesión</Link>
        </div>

        <p className="text-center mt-4">¿Aún no tienes cuenta?</p>
        <Link to="/validarCorreo" className="text-[#00B58E] font-semibold block text-center w-full hover:underline">Registrarse</Link>
        </div>
        </Layout>
    )
}

export default Login