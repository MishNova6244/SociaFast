"""
Schemas de usuario.
Solo definen estructura y tipos — sin lógica de negocio.
"""
from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    """Datos del formulario de registro — tal como llegan del frontend."""
    first_name:       str
    paternal_surname: str
    maternal_surname: str
    student_id:       str
    career:           str
    cuatrimestre:     Optional[int] = None
    email:            EmailStr
    password:         str
    confirm_password: str


class UserResponse(BaseModel):
    """
    Datos públicos del usuario.
    Nunca expone password_hash ni información sensible.
    """
    student_id:          str
    first_name:          str
    paternal_surname:    str
    maternal_surname:    str
    institutional_email: str
    status:              str
    profile_picture:     Optional[str] = None
    role:                str
    career:              Optional[str] = None
    cuatrimestre:        Optional[int] = None
    grupo:               Optional[str] = None
    genero:              Optional[str] = None
    failed_attempts:     int = 0
    accumulated_hours:   int = 0

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_user(cls, user) -> "UserResponse":
        """
        Construye el schema desde un objeto User de SQLAlchemy.
        Requiere que las relaciones role y career estén cargadas.
        career puede ser None para encargados y administradores.
        """
        return cls(
            student_id          = user.student_id,
            first_name          = user.first_name,
            paternal_surname    = user.paternal_surname,
            maternal_surname    = user.maternal_surname or "",
            institutional_email = user.institutional_email,
            status              = user.status,
            profile_picture     = user.profile_picture,
            role                = user.role.name,
            career              = user.career.slug if user.career else None,
            cuatrimestre        = user.cuatrimestre,
            grupo               = user.grupo,
            genero              = user.genero,
            failed_attempts     = user.failed_attempts,
            accumulated_hours   = user.accumulated_hours,
        )


class HoursUpdate(BaseModel):
    """Payload para actualizar las horas acumuladas del cuatrimestre."""
    hours: int


class SupervisorCreate(BaseModel):
    """Datos del formulario de registro de encargado."""

    first_name: str
    paternal_surname: str
    maternal_surname: str
    assigned_activity: str
    email: EmailStr
    password: str
    confirm_password: str


class AdminCreate(BaseModel):
    """Datos del formulario de registro de administrador."""
    first_name:        str
    paternal_surname:  str
    maternal_surname:  str
    email:             EmailStr
    password:          str
    confirm_password:  str
