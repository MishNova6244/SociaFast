"""
Servicio de actividades extracurriculares.
Lógica de negocio para gestión de actividades, inscripciones y asignaciones.
"""
from sqlalchemy.orm import Session
from app.core.exceptions import NotFoundException, ConflictException, ServerException
from app.models.user import User
from app.repositories.actividad_repository import ActividadRepository
from app.schemas.actividad import (
    ActividadResponse, ActividadCreate, EnrollRequest, AlumnoActividadResponse
)
from typing import List


class ActividadService:

    def __init__(self, db: Session):
        self.repo = ActividadRepository(db)

    def get_all(self, solo_activas: bool = True) -> List[ActividadResponse]:
        """Retorna todas las actividades disponibles."""
        actividades = self.repo.get_all(solo_activas)
        return [ActividadResponse.from_orm(a) for a in actividades]

    def get_by_id(self, id: int) -> ActividadResponse:
        """Retorna una actividad por su ID."""
        act = self.repo.get_by_id(id)
        if not act:
            raise NotFoundException("Actividad no encontrada")
        return ActividadResponse.from_orm(act)

    def create(self, data: ActividadCreate) -> ActividadResponse:
        """Crea una nueva actividad con sus horarios."""
        try:
            act_data = data.model_dump(exclude={"horarios"})
            horarios = [h.model_dump() for h in data.horarios]
            act = self.repo.create(act_data, horarios)
            return ActividadResponse.from_orm(act)
        except Exception:
            raise ServerException("Error al crear la actividad")

    def update(self, id: int, data: ActividadCreate) -> ActividadResponse:
        """Actualiza una actividad existente."""
        act = self.repo.get_by_id(id)
        if not act:
            raise NotFoundException("Actividad no encontrada")
        try:
            act_data = data.model_dump(exclude={"horarios"})
            horarios = [h.model_dump() for h in data.horarios]
            act = self.repo.update(act, act_data, horarios)
            return ActividadResponse.from_orm(act)
        except Exception:
            raise ServerException("Error al actualizar la actividad")

    def toggle_activa(self, id: int) -> ActividadResponse:
        """Activa o desactiva una actividad."""
        act = self.repo.get_by_id(id)
        if not act:
            raise NotFoundException("Actividad no encontrada")
        act = self.repo.toggle_activa(act)
        return ActividadResponse.from_orm(act)

    def get_students(self, actividad_id: int) -> List[AlumnoActividadResponse]:
        """Retorna los alumnos inscritos en la actividad del encargado."""
        students = self.repo.get_students(actividad_id)
        return [
            AlumnoActividadResponse(
                student_id        = s.student_id,
                first_name        = s.first_name,
                paternal_surname  = s.paternal_surname,
                grupo             = s.grupo,
                cuatrimestre      = s.cuatrimestre,
                accumulated_hours = s.accumulated_hours,
            )
            for s in students
        ]

    def enroll(self, student_id: str, data: EnrollRequest) -> dict:
        """Inscribe a un alumno en una actividad."""
        act = self.repo.get_by_id(data.actividad_id)
        if not act:
            raise NotFoundException("Actividad no encontrada")
        if not act.activa:
            raise ConflictException("La actividad no está disponible")

        # Si ya tiene una inscripción la cancela primero
        inscripcion_actual = self.repo.get_enrollment(student_id)
        if inscripcion_actual:
            if inscripcion_actual.actividad_id == data.actividad_id:
                raise ConflictException("Ya estás inscrito en esta actividad")
            self.repo.unenroll(student_id, inscripcion_actual.actividad_id)

        self.repo.enroll(student_id, data.actividad_id, data.periodo)
        return {"message": "Inscripción exitosa", "actividad": act.nombre}

    def unenroll(self, student_id: str, actividad_id: int) -> dict:
        """Cancela la inscripción de un alumno."""
        deleted = self.repo.unenroll(student_id, actividad_id)
        if not deleted:
            raise NotFoundException("No se encontró la inscripción")
        return {"message": "Inscripción cancelada"}

    def get_enrollment(self, student_id: str) -> dict:
        """Retorna la actividad actual del alumno."""
        inscripcion = self.repo.get_enrollment(student_id)
        if not inscripcion:
            return {"actividad": None}
        act = inscripcion.actividad
        return {
            "actividad": ActividadResponse.from_orm(act),
            "periodo":   inscripcion.periodo,
            "fecha_alta": inscripcion.fecha_alta,
        }

    def assign_to_supervisor(self, supervisor_id: str, actividad_id: int) -> dict:
        """Asigna una actividad al encargado."""
        act = self.repo.get_by_id(actividad_id)
        if not act:
            raise NotFoundException("Actividad no encontrada")
        self.repo.assign_to_supervisor(supervisor_id, actividad_id)
        return {"message": f"Actividad '{act.nombre}' asignada correctamente"}
