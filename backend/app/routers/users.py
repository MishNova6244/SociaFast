from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserResponse

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
def get_me(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Devuelve el perfil completo del usuario autenticado."""
    # Recargamos con joinedload para tener role y career disponibles
    user = UserRepository(db).get_by_matricula(current_user.matricula)
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
    )