function Button({text, type="button", OnClick}){
    return(
        <Button type={type} OnClick={OnClick} className="w-full bg-green-500 font-bold text-white px-6 py-3 rounded-full hover:bg-green-800 hover:scale-105 transition duration-200">
        {text}
        </Button>
    )
}

export default Button