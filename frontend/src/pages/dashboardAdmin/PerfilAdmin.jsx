import { FaUser, FaEnvelope, FaShield } from "react-icons/fa6"

function PerfilAdmin() {
  const user = { full_name: "Admin SociaFast", email: "admin@utpn.edu.mx" }
  const getInitials = (name = "") =>
    name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()

  return (
    <>
      <h2 className="text-3xl font-bold mb-6">Perfil</h2>
      <div className="flex justify-center">
        <div className="w-full max-w-xl bg-white rounded-xl shadow p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full bg-[#1A3A5C] text-white flex items-center justify-center text-3xl font-bold mb-3">
              {getInitials(user.full_name)}
            </div>
            <h3 className="text-xl font-bold uppercase text-center">{user.full_name}</h3>
            <span className="text-sm text-white bg-[#1A3A5C] px-3 py-1 rounded-full mt-2">Administrador de Horas</span>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="flex items-center gap-4 py-4">
              <div className="w-10 h-10 rounded-full bg-[#1A3A5C]/10 text-[#1A3A5C] flex items-center justify-center flex-shrink-0">
                <FaUser size={18} />
              </div>
              <div><p className="text-xs text-gray-400">Nombre completo</p><p className="font-semibold">{user.full_name}</p></div>
            </div>
            <div className="flex items-center gap-4 py-4">
              <div className="w-10 h-10 rounded-full bg-[#1A3A5C]/10 text-[#1A3A5C] flex items-center justify-center flex-shrink-0">
                <FaEnvelope size={18} />
              </div>
              <div><p className="text-xs text-gray-400">Correo institucional</p><p className="font-semibold">{user.email}</p></div>
            </div>
            <div className="flex items-center gap-4 py-4">
              <div className="w-10 h-10 rounded-full bg-[#1A3A5C]/10 text-[#1A3A5C] flex items-center justify-center flex-shrink-0">
                <FaShield size={18} />
              </div>
              <div><p className="text-xs text-gray-400">Rol</p><p className="font-semibold">Administrador de Horas de Servicio Social</p></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PerfilAdmin
