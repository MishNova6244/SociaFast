function Button({ text, type = "button", onClick }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full bg-green-500 font-bold text-white px-6 py-3 rounded-full hover:bg-green-800 hover:scale-105 transition duration-200"
    >
      {text}
    </button>
  )
}

export default Button
