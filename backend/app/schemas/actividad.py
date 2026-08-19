"""
Schemas de actividades extracurriculares.
Solo estructura y tipos — sin lógica de negocio.
"""
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class HorarioSchema(BaseModel):
    dia:  str
    hora: str


class ActividadResponse(BaseModel):
    """Datos públicos de una actividad — incluye horarios."""
    id:           int
    nombre:       str
    tipo:         str
    lugar:        Optional[str] = None
    encargado:    Optional[str] = None
    departamento: Optional[str] = None
    activa:       bool
    horarios:     List[HorarioSchema] = []

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm(cls, act) -> "ActividadResponse":
        return cls(
            id           = act.id,
            nombre       = act.nombre,
            tipo         = act.tipo,
            lugar        = act.lugar,
            encargado    = act.encargado,
            departamento = act.departamento,
            activa       = act.activa,
            horarios     = [{"dia": h.dia, "hora": h.hora} for h in act.horarios],
        )


class ActividadCreate(BaseModel):
    """Datos para crear o editar una actividad desde el admin."""
    nombre:       str
    tipo:         str
    lugar:        Optional[str] = None
    encargado:    Optional[str] = None
    departamento: Optional[str] = None
    horarios:     List[HorarioSchema] = []


class EnrollRequest(BaseModel):
    """Request para inscribir al alumno en una actividad."""
    actividad_id: int
    periodo:      Optional[str] = None


class AlumnoActividadResponse(BaseModel):
    """Datos del alumno en una actividad — para el encargado."""
    student_id:       str
    first_name:       str
    paternal_surname: str
    grupo:            Optional[str] = None
    cuatrimestre:     Optional[int] = None
    accumulated_hours: int = 0
    fecha_alta:       Optional[datetime] = None

    model_config = {"from_attributes": True}
