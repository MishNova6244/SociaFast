"""
Repositorio de actividades extracurriculares.
Maneja todas las operaciones de BD relacionadas con actividades,
horarios e inscripciones de alumnos.
"""
from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from app.models.actividad import Actividad, ActividadHorario, AlumnoActividad
from app.models.user import User


class ActividadRepository:

    def __init__(self, db: Session):
        self.db = db

    def _with_horarios(self):
        """Query base que carga los horarios en un solo JOIN."""
        return self.db.query(Actividad).options(joinedload(Actividad.horarios))

    def get_all(self, solo_activas: bool = True) -> List[Actividad]:
        """Retorna todas las actividades, opcionalmente solo las activas."""
        q = self._with_horarios()
        if solo_activas:
            q = q.filter(Actividad.activa == True)
        return q.order_by(Actividad.tipo, Actividad.nombre).all()

    def get_by_id(self, id: int) -> Optional[Actividad]:
        """Busca una actividad por su ID incluyendo horarios."""
        return self._with_horarios().filter(Actividad.id == id).first()

    def create(self, data: dict, horarios: list) -> Actividad:
        """Crea una actividad con sus horarios."""
        act = Actividad(**data)
        self.db.add(act)
        self.db.flush()  # obtiene el ID sin commit
        for h in horarios:
            self.db.add(ActividadHorario(actividad_id=act.id, dia=h["dia"], hora=h["hora"]))
        self.db.commit()
        self.db.refresh(act)
        return act

    def update(self, act: Actividad, data: dict, horarios: list) -> Actividad:
        """Actualiza una actividad y reemplaza sus horarios."""
        for key, val in data.items():
            setattr(act, key, val)
        # Elimina horarios viejos y agrega los nuevos
        self.db.query(ActividadHorario).filter(ActividadHorario.actividad_id == act.id).delete()
        for h in horarios:
            self.db.add(ActividadHorario(actividad_id=act.id, dia=h["dia"], hora=h["hora"]))
        self.db.commit()
        self.db.refresh(act)
        return act

    def toggle_activa(self, act: Actividad) -> Actividad:
        """Activa o desactiva una actividad."""
        act.activa = not act.activa
        self.db.commit()
        return act

    def get_students(self, actividad_id: int) -> List[User]:
        """Retorna todos los alumnos inscritos en una actividad."""
        return (
            self.db.query(User)
            .join(AlumnoActividad, AlumnoActividad.student_id == User.student_id)
            .filter(AlumnoActividad.actividad_id == actividad_id)
            .all()
        )

    def enroll(self, student_id: str, actividad_id: int, periodo: str = None) -> AlumnoActividad:
        """Inscribe a un alumno en una actividad."""
        inscripcion = AlumnoActividad(
            student_id   = student_id,
            actividad_id = actividad_id,
            periodo      = periodo,
        )
        self.db.add(inscripcion)
        self.db.commit()
        return inscripcion

    def unenroll(self, student_id: str, actividad_id: int) -> bool:
        """Desinscribe a un alumno de una actividad."""
        deleted = (
            self.db.query(AlumnoActividad)
            .filter(
                AlumnoActividad.student_id   == student_id,
                AlumnoActividad.actividad_id == actividad_id,
            )
            .delete()
        )
        self.db.commit()
        return deleted > 0

    def get_enrollment(self, student_id: str) -> Optional[AlumnoActividad]:
        """Retorna la inscripción activa de un alumno."""
        return (
            self.db.query(AlumnoActividad)
            .options(joinedload(AlumnoActividad.actividad).joinedload(Actividad.horarios))
            .filter(AlumnoActividad.student_id == student_id)
            .first()
        )

    def assign_to_supervisor(self, supervisor_id: str, actividad_id: int) -> None:
        """Asigna una actividad a un encargado."""
        user = self.db.query(User).filter(User.student_id == supervisor_id).first()
        if user:
            user.actividad_id = actividad_id
            self.db.commit()
