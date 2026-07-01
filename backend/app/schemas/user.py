from typing import Optional

from pydantic import BaseModel, EmailStr, field_validator, model_validator

DOMINIO_INSTITUCIONAL = "@utpn.edu.mx"


class UserCreate(BaseModel):
    """Datos que envía RegistroAlumno.jsx"""
    nombre: str
    apellido_paterno: str
    apellido_materno: Optional[str] = None
    matricula: str
    carrera: str          # llega como "siglas", ej. "mecatronica"
    correo: EmailStr
    password: str
    confirm_password: str

    @field_validator("correo")
    @classmethod
    def correo_de_estudiante(cls, v: str) -> str:
        if not v.endswith(DOMINIO_INSTITUCIONAL):
            raise ValueError(f"El correo debe terminar en {DOMINIO_INSTITUCIONAL}")
        usuario = v.split("@")[0]
        if not usuario.isdigit():
            raise ValueError("Este correo no corresponde a un estudiante")
        return v

    @field_validator("matricula")
    @classmethod
    def matricula_formato(cls, v: str) -> str:
        if not v.isdigit() or len(v) != 8:
            raise ValueError("La matrícula debe tener exactamente 8 dígitos")
        return v

    @model_validator(mode = "after")
    def passwords_coinciden(self):
        if self.password != self.confirm_password:
            raise ValueError("Las contraseñas no coinciden")
        return self


class UserResponse(BaseModel):
    """Lo que se expone al frontend (nunca incluye password_hash)"""
    matricula: str
    nombre: str
    apellido_paterno: str
    apellido_materno: Optional[str]
    correo_institucional: str
    estado: str
    foto_perfil: Optional[str]

    # Datos derivados de las relaciones (no columnas directas)
    rol: str
    carrera: str

    model_config = {"from_attributes": True}