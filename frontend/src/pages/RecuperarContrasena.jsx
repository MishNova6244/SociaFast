import Input from "../components/Input"
import Layout from "../components/Layout"
import {Link} from "react-router-dom"

function RecuperarContrasena(){
    return(
        <Layout className="">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Recuperar Contraseña</h2>

        <Input label="Ingrese su correo institucional:" type="email" placeholder="ejemplo@utpn.edu.mx"></Input>

        <div className="flex justify-center">
        <Link to="/actualizarContrasena" className="bg-[#06B800] font-bold text-white px-6 py-2 rounded-full hover:bg-green-800 hover:scale-105 transition">Verificar correo</Link>
        </div>

        </div>
        </Layout>
    )
}

export default RecuperarContrasena