import re
from typing import Optional

from pydantic import BaseModel, EmailStr, field_validator, model_validator

DOMINIO_INSTITUCIONAL = "@utpn.edu.mx"


class UserCreate(BaseModel):
    nombre: str
    apellido_paterno: str
    apellido_materno: Optional[str] = None
    matricula: str
    carrera: str
    correo: EmailStr
    password: str
    confirm_password: str

    @field_validator("correo")
    @classmethod
    def correo_de_estudiante(cls, v: str) -> str:
        if not v.endswith(DOMINIO_INSTITUCIONAL):
            raise ValueError(f"El correo debe terminar en {DOMINIO_INSTITUCIONAL}")
        if not v.split("@")[0].isdigit():
            raise ValueError("Este correo no corresponde a un estudiante")
        return v

    @field_validator("matricula")
    @classmethod
    def matricula_formato(cls, v: str) -> str:
        if not v.isdigit() or len(v) != 8:
            raise ValueError("La matrícula debe tener exactamente 8 dígitos")
        return v

    @field_validator("password")
    @classmethod
    def password_segura(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("La contraseña debe tener al menos 8 caracteres")
        if not re.search(r"[A-Z]", v):
            raise ValueError("La contraseña debe tener al menos una mayúscula")
        if not re.search(r"\d", v):
            raise ValueError("La contraseña debe tener al menos un número")
        return v

    @model_validator(mode="after")
    def passwords_coinciden(self):
        if self.password != self.confirm_password:
            raise ValueError("Las contraseñas no coinciden")
        return self


class UserResponse(BaseModel):
    matricula: str
    nombre: str
    apellido_paterno: str
    apellido_materno: Optional[str]
    correo_institucional: str
    estado: str
    foto_perfil: Optional[str]
    rol: str
    carrera: str
    intentos_fallidos: int = 0

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    nombre: Optional[str] = None
    apellido_paterno: Optional[str] = None
    apellido_materno: Optional[str] = None
    carrera: Optional[str] = None