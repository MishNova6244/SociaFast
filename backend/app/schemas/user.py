from typing import Literal, Optional
from pydantic import BaseModel, EmailStr, field_validator


CARRERAS_VALIDAS = {
    "mecatronica",
    "industrial",
    "logistica",
    "tecnologias",
    "arquitectura",
    "administracion",
    "contaduria",
    "mixta",
    "semiconductores",
}


class UserCreate(BaseModel):
    """Datos del formulario Registro.jsx"""
    nombre: str
    apellido_paterno: str
    apellido_materno: Optional[str] = None
    matricula: str
    carrera: str
    email: EmailStr
    password: str
    confirm_password: str

    @field_validator("carrera")
    @classmethod
    def carrera_valida(cls, v: str) -> str:
        if v not in CARRERAS_VALIDAS:
            raise ValueError(f"Carrera no válida: {v}")
        return v

    @field_validator("confirm_password")
    @classmethod
    def passwords_match(cls, v: str, info) -> str:
        if "password" in info.data and v != info.data["password"]:
            raise ValueError("Las contraseñas no coinciden")
        return v

    @field_validator("matricula")
    @classmethod
    def matricula_formato(cls, v: str) -> str:
        v = v.strip()
        if not v.isdigit() or len(v) != 8:
            raise ValueError("La matrícula debe tener exactamente 8 dígitos")
        return v


class UserResponse(BaseModel):
    """Datos públicos del usuario (nunca expone password)."""
    id: str
    nombre: str
    apellido_paterno: str
    apellido_materno: Optional[str]
    matricula: str
    carrera: str
    email: str
    role: str
    is_active: bool

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    """Campos opcionales para actualizar perfil."""
    nombre: Optional[str] = None
    apellido_paterno: Optional[str] = None
    apellido_materno: Optional[str] = None
    carrera: Optional[str] = None