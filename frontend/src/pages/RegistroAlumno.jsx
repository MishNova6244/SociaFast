import Input from "../components/Input"
import Layout from "../components/Layout"
import {Link} from "react-router-dom"

function Registro() {
  return (
        <Layout className="py-8">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full">

            <h2 className="text-2xl font-bold text-center mb-6">Crear Cuenta</h2>

            <Input label="Nombre(s):" type="text" placeholder="Ingrese su nombre"></Input>

            <Input label="Apellido paterno:" type="text" placeholder="Ingrese su apellido paterno"></Input>

            <Input label="Apellido materno:" type="text" placeholder="Ingrese su apellido materno"></Input>

            <Input label="Matrícula:" type="text" placeholder="Ejemplo: 25310206"></Input>

            <label className="block mb-2 font-medium">Carrera:</label>
            <select className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#18AD8F] transition duration-200">
                <option value="" disabled>Seleccione una carrera</option>
                <option value="mecatronica">Ing. en Mecatrónica</option>
                <option value="industrial">Ing. Industrial</option>
                <option value="logistica">Ing. en Logística Internacional</option>
                <option value="tecnologias">Ing. en Tecnologías de la Información e Innovación Digital</option>
                <option value="arquitectura">Lic. en Arquitectura</option>
                <option value="administracion">Lic. en Administración</option>
                <option value="contaduria">Lic. en Contaduría</option>
                <option value="mixta">Modalidad Mixta</option>
                <option value="semiconductores">Semiconductores</option>
            </select>

            <Input label="Contraseña:" type="password" placeholder="Ingrese una contraseña"></Input>

            <Input label="Confirmar contraseña:" type="password" placeholder="Confirme su contraseña"></Input>

            <div className="w-full flex justify-center">
                <button className="bg-green-500 font-bold text-white px-6 py-2 rounded-full hover:bg-green-800 hover:scale-105 transition duration-200">
                Crear cuenta
                </button>
            </div>

            <p className="text-center mt-4">¿Ya tienes una cuenta?</p>
            <Link to="/" className="text-[#00B58E] font-semibold block text-center w-full hover:underline">Iniciar sesión</Link>
            </div>
        </Layout>
  )
}

export default Registro