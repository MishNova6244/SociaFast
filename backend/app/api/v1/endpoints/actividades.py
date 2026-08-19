"""
Endpoints de actividades extracurriculares.

Rutas:
  GET    /api/v1/activities              ← lista actividades (público)
  GET    /api/v1/activities/{id}         ← detalle de una actividad
  POST   /api/v1/activities              ← crear actividad (admin)
  PUT    /api/v1/activities/{id}         ← editar actividad (admin)
  PATCH  /api/v1/activities/{id}/toggle  ← activar/desactivar (admin)
  GET    /api/v1/activities/{id}/students ← alumnos inscritos (encargado)
  POST   /api/v1/activities/enroll       ← alumno se inscribe
  DELETE /api/v1/activities/{id}/enroll  ← alumno cancela inscripción
  GET    /api/v1/activities/my-enrollment ← actividad actual del alumno
  PATCH  /api/v1/activities/assign       ← encargado asigna su actividad
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.dependencies import get_current_user, get_admin, get_supervisor, get_student
from app.database.session import get_db
from app.models.user import User
from app.schemas.actividad import ActividadResponse, ActividadCreate, EnrollRequest, AlumnoActividadResponse
from app.services.actividad_service import ActividadService

router = APIRouter(prefix="/activities", tags=["activities"])


@router.get("", response_model=List[ActividadResponse])
def get_activities(db: Session = Depends(get_db)):
    """Lista todas las actividades activas — público."""
    return ActividadService(db).get_all()


@router.get("/my-enrollment")
def get_my_enrollment(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_student),
):
    """Retorna la actividad en la que está inscrito el alumno."""
    return ActividadService(db).get_enrollment(current_user.student_id)


@router.get("/{id}", response_model=ActividadResponse)
def get_activity(id: int, db: Session = Depends(get_db)):
    """Retorna el detalle de una actividad por ID."""
    return ActividadService(db).get_by_id(id)


@router.get("/{id}/students", response_model=List[AlumnoActividadResponse])
def get_students(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_supervisor),
):
    """Retorna los alumnos inscritos en una actividad — encargado y admin."""
    return ActividadService(db).get_students(id)


@router.post("", response_model=ActividadResponse)
def create_activity(
    data: ActividadCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin),
):
    """Crea una nueva actividad — solo admin."""
    return ActividadService(db).create(data)


@router.put("/{id}", response_model=ActividadResponse)
def update_activity(
    id: int,
    data: ActividadCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin),
):
    """Edita una actividad existente — solo admin."""
    return ActividadService(db).update(id, data)


@router.patch("/{id}/toggle", response_model=ActividadResponse)
def toggle_activity(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin),
):
    """Activa o desactiva una actividad — solo admin."""
    return ActividadService(db).toggle_activa(id)


@router.post("/enroll")
def enroll(
    data: EnrollRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_student),
):
    """Inscribe al alumno en una actividad."""
    return ActividadService(db).enroll(current_user.student_id, data)


@router.delete("/{id}/enroll")
def unenroll(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_student),
):
    """Cancela la inscripción del alumno en una actividad."""
    return ActividadService(db).unenroll(current_user.student_id, id)


@router.patch("/assign")
def assign_activity(
    data: EnrollRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_supervisor),
):
    """Asigna una actividad al encargado autenticado."""
    return ActividadService(db).assign_to_supervisor(current_user.student_id, data.actividad_id)
