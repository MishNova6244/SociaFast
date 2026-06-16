# app/schemas/__init__.py
"""
Schemas para validación de datos con Pydantic.
Definen cómo se reciben y responden los datos.
"""

# BaseModel → clase padre para crear schemas
from pydantic import BaseModel


class UsuarioCreate(BaseModel):
    """
    Schema para crear un usuario (registro).
    Acepta cualquier email @utpn.edu.mx, sea letra o número.
    """
    # Matrícula del estudiante (ej: 25310205 o A00123456)
    matricula: str
    
    # Email completo (ej: 25310205@utpn.edu.mx)
    email: str
    
    # Nombre completo
    nombre: str
    
    # Carrera
    carrera: str
    
    # Contraseña
    password: str


class LoginRequest(BaseModel):
    """
    Schema para iniciar sesión.
    Solo requiere email y password.
    """
    email: str
    password: str


class UsuarioResponse(BaseModel):
    """
    Schema para responder datos del usuario (sin password).
    """
    matricula: str
    email: str
    nombre: str
    carrera: str
    rol: str

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """
    Schema para responder el token JWT después del login.
    """
    access_token: str
    token_type: str
    usuario: UsuarioResponse