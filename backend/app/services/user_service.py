"""
Servicio de usuario autenticado.
Maneja la lógica de negocio del perfil y actualización de horas.
Solo puede ser llamado por usuarios que ya pasaron por la autenticación (JWT válido).
"""
from sqlalchemy.orm import Session

from app.core.constants import MAX_HOURS_PER_TERM
from app.core.exceptions import NotFoundException, ConflictException, ServerException
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserResponse, HoursUpdate


class UserService:

    def __init__(self, db: Session):
        # Instancia del repositorio — toda la lógica de BD pasa por aquí
        self.repo = UserRepository(db)

    def get_profile(self, student_id: str) -> UserResponse:
        """
        Retorna el perfil público del usuario autenticado.
        Busca por student_id (matrícula) que viene del JWT decodificado.
        Lanza 404 si el usuario no existe (caso raro pero posible si fue eliminado).
        """
        try:
            user = self.repo.get_by_student_id(student_id)
            if not user:
                raise NotFoundException("Usuario no encontrado")
            return UserResponse.from_orm_user(user)
        except NotFoundException:
            raise  # re-lanza sin modificar para que FastAPI devuelva el 404 correcto
        except Exception:
            raise ServerException("Error al obtener el perfil")

    def update_hours(self, user: User, data: HoursUpdate) -> UserResponse:
        """
        Actualiza las horas acumuladas del cuatrimestre actual.
        Valida que el valor esté entre 0 y MAX_HOURS_PER_TERM (48).
        La validación de rango aquí es de negocio — el frontend valida el formato.
        """
        try:
            # Validación de regla de negocio: no se pueden registrar más horas de las permitidas
            if not (0 <= data.hours <= MAX_HOURS_PER_TERM):
                raise ConflictException(
                    f"Las horas deben estar entre 0 y {MAX_HOURS_PER_TERM}"
                )
            updated = self.repo.update_hours(user, data.hours)
            return UserResponse.from_orm_user(updated)
        except ConflictException:
            raise
        except Exception:
            raise ServerException("Error al actualizar las horas")
