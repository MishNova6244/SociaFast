// Regex para detectar el rol del usuario por su correo institucional

// Alumno: 8 dígitos antes del @
export const ESTUDIANTE_REGEX = /^\d{8}@utpn\.edu\.mx$/

// Encargado: letras (con punto opcional) antes del @
export const ENCARGADO_REGEX = /^[a-zA-Z]+(\.[a-zA-Z]+)*@utpn\.edu\.mx$/

// Correo único del administrador
export const ADMIN_EMAIL = "admin@utpn.edu.mx"

// Valida que sea cualquier correo @utpn.edu.mx
export const EMAIL_REGEX = /^[^\s@]+@utpn\.edu\.mx$/
