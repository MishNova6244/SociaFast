import { forwardRef, useId } from "react"

const TextArea = forwardRef(({ label, error, rows=6, className="", ...props }, ref) => {
    const id = useId() // Generación de ID único (misma estructura que Input.jsx) 

    return(
        <div className={`mb-4 ${className}`}>
            {label && (
                <label htmlFor={id} className="block mb-2 font-medium">{label}</label>
            )}

            <textarea 
                {...props} // Permite agregar todas las propiedades que se utilizarán.
                id={id} 
                ref={ref} // Referencias.
                rows={rows} //Define la altura visible del área de texto
                className={`w-full min-h-24 border rounded-lg p-3 text-sm md:text-base focus:outline-none focus:ring-2 transition duration-200 resize-y
                ${error ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-[#18AD8F]"}`}
            />
                

            {error && (
                <p className="text-red-500 text-xs md:text-sm mt-1">{error}</p> )}

        </div>
    )
})

TextArea.displayName = "TextArea"

export default TextArea