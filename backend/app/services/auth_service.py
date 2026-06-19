from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.exceptions import ConflictException, UnauthorizedException
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.user import UserCreate, UserResponse


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    # ── Registro ───────────────────────────────────────────────

    def register(self, data: UserCreate) -> UserResponse:
        """Crea un nuevo usuario con rol 'estudiante'."""

        # Verificar duplicados
        if self.db.query(User).filter(User.email == data.email).first():
            raise ConflictException("El correo ya está registrado")

        if self.db.query(User).filter(User.matricula == data.matricula).first():
            raise ConflictException("La matrícula ya está registrada")

        new_user = User(
            nombre=data.nombre,
            apellido_paterno=data.apellido_paterno,
            apellido_materno=data.apellido_materno,
            matricula=data.matricula,
            carrera=data.carrera,
            email=data.email,
            password=get_password_hash(data.password),
            role="estudiante",
        )
        self.db.add(new_user)
        self.db.commit()
        self.db.refresh(new_user)
        return UserResponse.model_validate(new_user)

    # ── Login ──────────────────────────────────────────────────

    def login(self, data: LoginRequest) -> TokenResponse:
        """Verifica credenciales y devuelve el JWT."""

        user = self.db.query(User).filter(User.email == data.email).first()

        if not user or not verify_password(data.password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Correo o contraseña incorrectos",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Tu cuenta está desactivada. Contacta al encargado.",
            )

        token = create_access_token({
            "sub": user.id,
            "role": user.role,
            "email": user.email,
        })

        return TokenResponse(
            access_token=token,
            role=user.role,
            user_id=user.id,
            nombre=user.nombre,
        )