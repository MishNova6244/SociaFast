"""
Schemas de autenticación.
Solo definen estructura y tipos — sin lógica de negocio.
"""
from pydantic import BaseModel, EmailStr


class ValidateEmailRequest(BaseModel):
    email: EmailStr


class ValidateEmailResponse(BaseModel):
    is_student:         bool
    already_registered: bool
    message:            str


class LoginRequest(BaseModel):
    email:    EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"
    role:         str
    student_id:   str
    full_name:    str


# ── Recuperación de contraseña ────────────────────────────────────────────────

class PasswordResetRequest(BaseModel):
    """El usuario proporciona su correo institucional para iniciar la recuperación."""
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    """El usuario envía el token de 6 dígitos recibido por correo y su nueva contraseña."""
    token:            str
    new_password:     str
    confirm_password: str


class MessageResponse(BaseModel):
    """Respuesta genérica de éxito o información."""
    message: str
    detail:  str = ""
