from datetime import datetime
from typing import Optional

from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.models.user import User
from app.models.career import Career


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def _query_with_relations(self):
        return self.db.query(User).options(
            joinedload(User.role),
            joinedload(User.career)
        )

    def get_by_correo(self, correo: str) -> Optional[User]:
        return self._query_with_relations().filter(
            User.correo_institucional == correo
        ).first()

    def get_by_matricula(self, matricula: str) -> Optional[User]:
        return self._query_with_relations().filter(
            User.matricula == matricula
        ).first()

    def get_career_id_by_siglas(self, siglas: str) -> Optional[int]:
        career = self.db.query(Career).filter(Career.siglas == siglas).first()
        return career.id if career else None

    def create(self, user: User) -> User:
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update_login_exitoso(self, user: User) -> None:
        user.ultimo_acceso    = func.now()
        user.intentos_fallidos = 0
        self.db.commit()

    def incrementar_intentos_fallidos(self, user: User) -> None:
        user.intentos_fallidos += 1
        self.db.commit()

    def update_horas(self, user: User, horas: int) -> User:
        user.horas_acumuladas = horas
        self.db.commit()
        self.db.refresh(user)
        return user