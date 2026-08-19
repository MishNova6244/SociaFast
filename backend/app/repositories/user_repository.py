"""
Repositorio de usuarios.
Único punto de acceso a la tabla 'usuarios' y tablas relacionadas.
"""
import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import func
from sqlalchemy.orm import joinedload, Session

from app.core.constants import ROLE_SUPERVISOR
from app.core.security import hash_password
from app.models.career import Career
from app.models.user import User
from app.repositories.base_repository import BaseRepository


class UserRepository(BaseRepository[User]):

    def __init__(self, db: Session):
        super().__init__(db, User)

    def create(self, instance: User) -> User:
        """Inserta el usuario y lo recarga con sus relaciones."""
        self.db.add(instance)
        self.db.commit()
        return self.get_by_student_id(instance.student_id)

    def _with_relations(self):
        """Query base que carga role y career en un solo JOIN — evita N+1."""
        return self.db.query(User).options(
            joinedload(User.role),
            joinedload(User.career),
        )

    def get_by_email(self, email: str) -> Optional[User]:
        """Busca un usuario por su correo institucional."""
        return self._with_relations().filter(User.institutional_email == email).first()

    def get_by_student_id(self, student_id: str) -> Optional[User]:
        """Busca un usuario por su matrícula o identificador único."""
        return self._with_relations().filter(User.student_id == student_id).first()

    def get_by_reset_token(self, token: str) -> Optional[User]:
        """Busca un usuario por su token de recuperación de contraseña."""
        return self.db.query(User).filter(User.reset_token == token).first()

    def get_career_id_by_slug(self, slug: str) -> Optional[int]:
        """Obtiene el ID de una carrera por su slug."""
        career = self.db.query(Career).filter(Career.slug == slug).first()
        return career.id if career else None

    def create_supervisor(self, data) -> User:
        """Crea un encargado sin matrícula ni carrera — genera ID único tipo ENC######."""
        supervisor_id = f"ENC{uuid.uuid4().hex[:6].upper()}"
        user = User(
            student_id          = supervisor_id,
            first_name          = data.first_name,
            paternal_surname    = data.paternal_surname,
            maternal_surname    = data.maternal_surname,
            institutional_email = data.email,
            password_hash       = hash_password(data.password),
            career_id           = None,
            role_id             = ROLE_SUPERVISOR,
        )
        return self.create(user)

    def record_successful_login(self, user: User) -> None:
        """Actualiza la fecha de último acceso y reinicia intentos fallidos."""
        user.last_access     = func.now()
        user.failed_attempts = 0
        self.db.commit()
        self.db.refresh(user)

    def increment_failed_attempts(self, user: User) -> None:
        """Incrementa el contador de intentos fallidos."""
        user.failed_attempts += 1
        self.db.commit()

    def update_hours(self, user: User, hours: int) -> User:
        """Actualiza las horas acumuladas del cuatrimestre."""
        user.accumulated_hours = hours
        self.db.commit()
        self.db.refresh(user)
        return user

    def set_reset_token(self, user: User, token: str, expires: datetime) -> None:
        """Guarda el token de recuperación y su fecha de expiración."""
        user.reset_token         = token
        user.reset_token_expires = expires
        self.db.commit()

    def clear_reset_token(self, user: User) -> None:
        """Elimina el token de recuperación después de usarlo o expirar."""
        user.reset_token         = None
        user.reset_token_expires = None
        self.db.commit()

    def update_password(self, user: User, hashed_password: str) -> None:
        """Actualiza la contraseña y limpia el token de recuperación."""
        user.password_hash       = hashed_password
        user.reset_token         = None
        user.reset_token_expires = None
        self.db.commit()

    def is_reset_token_valid(self, user: User) -> bool:
        """Verifica que el token existe y no ha expirado."""
        if not user.reset_token or not user.reset_token_expires:
            return False
        now     = datetime.now(timezone.utc)
        expires = user.reset_token_expires
        if expires.tzinfo is None:
            expires = expires.replace(tzinfo=timezone.utc)
        return now < expires

    def create_admin(self, data) -> User:
        """Crea un administrador sin matrícula ni carrera."""
        admin_id = f"ADM{uuid.uuid4().hex[:6].upper()}"
        user = User(
            student_id          = admin_id,
            first_name          = data.first_name,
            paternal_surname    = data.paternal_surname,
            maternal_surname    = data.maternal_surname,
            institutional_email = data.email,
            password_hash       = hash_password(data.password),
            career_id           = None,
            role_id             = ROLE_ADMIN,
        )
        return self.create(user)
