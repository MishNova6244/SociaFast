"""
Endpoints de usuario autenticado.
Todas las rutas requieren un JWT válido en el header Authorization.

Rutas disponibles:
  GET   /api/v1/users/me        — retorna el perfil del usuario autenticado
  PATCH /api/v1/users/me/hours  — actualiza las horas acumuladas del cuatrimestre
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.user import UserResponse, HoursUpdate
from app.services.user_service import UserService

# Prefijo /users — todas las rutas aquí son /api/v1/users/...
router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
def get_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Retorna el perfil completo del usuario autenticado.
    El frontend llama este endpoint al cargar el dashboard
    para mostrar nombre, carrera, horas acumuladas, etc.
    """
    return UserService(db).get_profile(current_user.student_id)


@router.patch("/me/hours", response_model=UserResponse)
def update_hours(
    data: HoursUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Actualiza las horas acumuladas del cuatrimestre actual.
    El valor debe estar entre 0 y 48 (MAX_HOURS_PER_TERM).
    Retorna el perfil completo actualizado para que el frontend
    pueda refrescar la barra de progreso sin hacer otra request.
    """
    return UserService(db).update_hours(current_user, data)
