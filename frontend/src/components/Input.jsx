import { useState, forwardRef, useId } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa6"

// ...props permite utilizar propiedades como: value, onChange, placeholder, disabled, etc, sin necesidad de declararlas
const Input = forwardRef(({ label, type = "text", error, className="", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const id = useId() /* Selecciona automáticamente el campo de texto al dar clic a su label correspondiente,
                          brindando accesibilidad para personas que utilizan lectores de pantalla */


    const isPassword = type === "password"

    return(
        <div className={`mb-4 ${className}`}>
            {label && (
                <label htmlFor={id} className="block mb-2 font-medium">{label}</label>
            )}
            <div className="relative">    
                <input 
                    {...props} // Inserta limpia y ordenadamente todas las propiedades que se utilizarán
                    id={id} 
                    ref={ref} // Conecta referencias para permitir la comunicación entre componentes
                    type={isPassword ? (showPassword ? "text" : "password") : type} 
                    className={`w-full border rounded-lg p-3 pr-10 text-sm md:text-base focus:outline-none focus:ring-2 transition duration-200 
                    ${error ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-[#18AD8F]"}`}
                />
                
                {isPassword  && (
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#18AD8F] transition-colors duration-200">
                        {showPassword ? <FaEyeSlash size={20}/> : <FaEye size={20}/>}
                    </button>
                )}
            </div>

            {error && (
                <p className="text-red-500 text-xs md:text-sm mt-1">{error}</p> )}

        </div>
    )
})

Input.displayName = "Input"

export default Input