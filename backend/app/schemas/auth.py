import re

from pydantic import BaseModel, EmailStr, field_validator

DOMINIO_INSTITUCIONAL = "@utpn.edu.mx"


class ValidarCorreoRequest(BaseModel):
    correo: EmailStr

    @field_validator("correo")
    @classmethod
    def dominio_valido(cls, v: str) -> str:
        if not v.endswith(DOMINIO_INSTITUCIONAL):
            raise ValueError(f"El correo debe terminar en {DOMINIO_INSTITUCIONAL}")
        return v


class ValidarCorreoResponse(BaseModel):
    es_estudiante: bool
    mensaje: str


class LoginRequest(BaseModel):
    correo: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    rol: str
    matricula: str
    nombre: str