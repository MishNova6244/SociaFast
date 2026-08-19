"""Servicio de autenticación — registro, login y recuperación de contraseña."""
import secrets
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session

from app.core.constants import ROLE_STUDENT, STATUS_ACTIVE
from app.core.exceptions import ConflictException, UnauthorizedException, ForbiddenException, ServerException
from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import ValidateEmailResponse, LoginRequest, TokenResponse, PasswordResetRequest, PasswordResetConfirm, MessageResponse
from app.schemas.user import UserCreate, UserResponse, SupervisorCreate, AdminCreate
from app.services.email_service import EmailService


class AuthService:

    def __init__(self, db: Session):
        self.repo  = UserRepository(db)
        self.email = EmailService()

    def register_supervisor(self, data: SupervisorCreate) -> UserResponse:
        """Registra un nuevo encargado sin matrícula ni carrera."""
        if self.repo.get_by_email(data.email):
            raise ConflictException("El correo ya está registrado")
        supervisor = self.repo.create_supervisor(data)
        return UserResponse.from_orm_user(supervisor)


    def register_admin(self, data: AdminCreate) -> UserResponse:
        """Registra un nuevo administrador sin matrícula ni carrera."""
        if self.repo.get_by_email(data.email):
            raise ConflictException("El correo ya está registrado")
        admin = self.repo.create_admin(data)
        return UserResponse.from_orm_user(admin)

    def validate_email(self, email: str) -> ValidateEmailResponse:
        """Verifica si el correo es de estudiante y si ya tiene cuenta."""
        is_student         = email.split("@")[0].isdigit()
        already_registered = self.repo.get_by_email(email) is not None
        if already_registered:
            msg = "Este correo ya tiene una cuenta registrada."
        elif is_student:
            msg = "Correo válido, continúa con el registro."
        else:
            msg = "Las cuentas de encargado son gestionadas por el sistema."
        return ValidateEmailResponse(is_student=is_student, already_registered=already_registered, message=msg)

    def register(self, data: UserCreate) -> UserResponse:
        """Registra un nuevo estudiante validando duplicados y consistencia matrícula-correo."""
        if self.repo.get_by_email(data.email):
            raise ConflictException("El correo ya está registrado")
        if self.repo.get_by_student_id(data.student_id):
            raise ConflictException("La matrícula ya está registrada")
        if data.student_id != data.email.split("@")[0]:
            raise ConflictException("La matrícula debe coincidir con el número del correo institucional")
        career_id = self.repo.get_career_id_by_slug(data.career)
        if not career_id:
            raise ConflictException("Carrera no válida")
        user = self.repo.create(User(
            student_id=data.student_id, first_name=data.first_name,
            paternal_surname=data.paternal_surname, maternal_surname=data.maternal_surname,
            institutional_email=data.email, password_hash=hash_password(data.password),
            career_id=career_id, role_id=ROLE_STUDENT, cuatrimestre=data.cuatrimestre,
        ))
        return UserResponse.from_orm_user(user)

    def login(self, data: LoginRequest) -> TokenResponse:
        """Autentica al usuario y retorna un JWT."""
        user = self.repo.get_by_email(data.email)
        if not user or not verify_password(data.password, user.password_hash):
            if user:
                self.repo.increment_failed_attempts(user)
            raise UnauthorizedException("Correo o contraseña incorrectos")
        if user.status != STATUS_ACTIVE:
            raise ForbiddenException("Cuenta inactiva. Contacta a tu encargado.")
        self.repo.record_successful_login(user)
        return TokenResponse(
            access_token=create_access_token({"sub": user.student_id, "role": user.role.name}),
            role=user.role.name, student_id=user.student_id,
            full_name=f"{user.first_name} {user.paternal_surname} {user.maternal_surname or ''}".strip(),
        )

    async def forgot_password(self, data: PasswordResetRequest) -> MessageResponse:
        """Genera token de 6 dígitos y lo envía al correo. Siempre responde con éxito."""
        try:
            user = self.repo.get_by_email(data.email)
            if user:
                token   = str(secrets.randbelow(900000) + 100000)
                expires = datetime.now(timezone.utc) + timedelta(minutes=15)
                self.repo.set_reset_token(user, token, expires)
                name = f"{user.first_name} {user.paternal_surname}".strip()
                await self.email.send_password_reset(user.institutional_email, token, name)
            return MessageResponse(
                message="Si el correo existe, recibirás las instrucciones en breve.",
                detail="Revisa tu bandeja de entrada y carpeta de spam.",
            )
        except Exception as e:
            print(f"[ERROR forgot_password] {type(e).__name__}: {e}")
            raise ServerException("Error al procesar la solicitud")

    async def reset_password(self, data: PasswordResetConfirm) -> MessageResponse:
        """Valida el token y actualiza la contraseña."""
        if data.new_password != data.confirm_password:
            raise ConflictException("Las contraseñas no coinciden")
        user = self.repo.get_by_reset_token(data.token)
        if not user:
            raise ConflictException("Token inválido")
        if not self.repo.is_reset_token_valid(user):
            self.repo.clear_reset_token(user)
            raise ConflictException("El token ha expirado. Solicita uno nuevo.")
        self.repo.update_password(user, hash_password(data.new_password))
        name = f"{user.first_name} {user.paternal_surname}".strip()
        await self.email.send_password_changed(user.institutional_email, name)
        return MessageResponse(
            message="Contraseña restablecida exitosamente.",
            detail="Ya puedes iniciar sesión con tu nueva contraseña.",
        )
