from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserResponse, HorasUpdate

router = APIRouter(prefix="/users", tags=["users"])


def _build_response(user: User) -> UserResponse:
    """Construye UserResponse desde un objeto User con relaciones cargadas."""
    return UserResponse(
        matricula=user.matricula,
        nombre=user.nombre,
        apellido_paterno=user.apellido_paterno,
        apellido_materno=user.apellido_materno,
        correo_institucional=user.correo_institucional,
        estado=user.estado,
        foto_perfil=user.foto_perfil,
        rol=user.role.nombre,
        carrera=user.career.siglas,
        intentos_fallidos=user.intentos_fallidos,
        horas_acumuladas=user.horas_acumuladas,
    )


@router.get("/me", response_model=UserResponse)
def get_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    user = UserRepository(db).get_by_matricula(current_user.matricula)
    return _build_response(user)


@router.patch("/me/horas", response_model=UserResponse)
def update_horas(
    data: HorasUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repo = UserRepository(db)
    user = repo.get_by_matricula(current_user.matricula)
    user = repo.update_horas(user, data.horas)
    return _build_response(user)