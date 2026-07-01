function Input({ label, type, placeholder, value, onChange}){
    return(
        <div className="mb-4">
            <label className="block mb-2 font-medium">{label}</label>
            <input type={type} placeholder={placeholder} value={value} onChange={onChange}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#18AD8F] transition duration-200"/>
        </div>
    )
}

export default Input