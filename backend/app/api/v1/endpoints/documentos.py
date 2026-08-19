"""
Endpoints de generación de documentos PDF.

Rutas:
  POST /api/v1/docs/reporte-final      ← alumno genera su reporte final
  POST /api/v1/docs/control-horas      ← alumno genera su control de horas
  POST /api/v1/docs/evaluacion/{id}    ← encargado genera evaluación de un alumno
  POST /api/v1/docs/constancia/{id}    ← admin genera constancia con sello
  POST /api/v1/docs/boleta/{id}        ← admin genera boleta con sello
"""
from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, get_student, get_supervisor, get_admin
from app.core.exceptions import NotFoundException
from app.database.session import get_db
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.documento import ReporteForm, EvaluacionForm
from app.services.documento_service import (
    generar_constancia, generar_boleta,
    generar_reporte_final, generar_control_horas,
    generar_evaluacion_desempeno,
)

router = APIRouter(prefix="/docs", tags=["documentos"])


def _alumno_dict(user: User) -> dict:
    """Convierte un User en el dict que necesita documento_service."""
    return {
        "student_id": user.student_id,
        "first_name": user.first_name,
        "paternal_surname": user.paternal_surname,
        "maternal_surname": user.maternal_surname,
        "career": user.career.name if user.career else "",
        "cuatrimestre": user.cuatrimestre,
        "grupo": user.grupo,
        "actividad": (
            user.actividad_inscrita.actividad.nombre if user.actividad_inscrita else ""
        ),
    }


def _pdf_response(pdf_bytes: bytes, filename: str) -> Response:
    return Response(
        content     = pdf_bytes,
        media_type  = "application/pdf",
        headers     = {"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.post("/reporte-final")
def generar_reporte(
    form: ReporteForm,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_student),
):
    """Alumno genera su reporte final con sus datos prellenados."""
    pdf = generar_reporte_final(_alumno_dict(current_user), form.model_dump())
    return _pdf_response(pdf, f"ReporteFinal_{current_user.student_id}.pdf")


@router.post("/control-horas")
def generar_control(
    form: ReporteForm,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_student),
):
    """Alumno genera su control de horas con sus datos prellenados."""
    pdf = generar_control_horas(_alumno_dict(current_user), form.model_dump())
    return _pdf_response(pdf, f"ControlHoras_{current_user.student_id}.pdf")


@router.post("/evaluacion/{student_id}")
def generar_evaluacion(
    student_id: str,
    form: EvaluacionForm,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_supervisor),
):
    """Encargado genera la evaluación de desempeño de un alumno."""
    repo  = UserRepository(db)
    alumno = repo.get_by_student_id(student_id)
    if not alumno:
        raise NotFoundException("Alumno no encontrado")
    pdf = generar_evaluacion_desempeno(_alumno_dict(alumno), form.model_dump())
    return _pdf_response(pdf, f"Evaluacion_{student_id}.pdf")


@router.post("/constancia/{student_id}")
def generar_constancia_admin(
    student_id: str,
    con_sello: bool = True,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin),
):
    """Admin genera la constancia de servicio social — con sello si se aprueba."""
    repo   = UserRepository(db)
    alumno = repo.get_by_student_id(student_id)
    if not alumno:
        raise NotFoundException("Alumno no encontrado")
    pdf = generar_constancia(_alumno_dict(alumno), con_sello=con_sello)
    return _pdf_response(pdf, f"Constancia_{student_id}.pdf")


@router.post("/boleta/{student_id}")
def generar_boleta_admin(
    student_id: str,
    con_sello: bool = True,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_admin),
):
    """Admin genera la boleta de liberación — con sello si se aprueba."""
    repo   = UserRepository(db)
    alumno = repo.get_by_student_id(student_id)
    if not alumno:
        raise NotFoundException("Alumno no encontrado")
    pdf = generar_boleta(_alumno_dict(alumno), con_sello=con_sello)
    return _pdf_response(pdf, f"Boleta_{student_id}.pdf")
