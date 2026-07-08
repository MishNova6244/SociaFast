from sqlalchemy.orm import Session

from app.core.exceptions import ConflictException, UnauthorizedException, ForbiddenException
from app.core.security import hash_password, verify_password, create_token
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import ValidarCorreoResponse, LoginRequest, TokenResponse
from app.schemas.user import UserCreate, UserResponse


class AuthService:
    def __init__(self, db: Session):
        self.repo = UserRepository(db)

    # ── Paso 1: ValidacionCorreo.jsx ───────────────────────────
    def validar_correo(self, correo: str) -> ValidarCorreoResponse:
        usuario = correo.split("@")[0]
        if usuario.isdigit():
            return ValidarCorreoResponse(
                es_estudiante=True,
                mensaje="Correo válido, continúa con tu registro.",
            )
        return ValidarCorreoResponse(
            es_estudiante=False,
            mensaje="El registro de encargados será administrado por el sistema.",
        )

    # ── Paso 2: RegistroAlumno.jsx ──────────────────────────────
    def register(self, data: UserCreate) -> UserResponse:
        if self.repo.get_by_correo(data.correo):
            raise ConflictException("El correo ya está registrado")
        if self.repo.get_by_matricula(data.matricula):
            raise ConflictException("La matrícula ya está registrada")

        career_id = self.repo.get_career_id_by_siglas(data.carrera)
        if not career_id:
            raise ConflictException("La carrera seleccionada no es válida")

        nuevo_usuario = User(
            matricula=data.matricula,
            nombre=data.nombre,
            apellido_paterno=data.apellido_paterno,
            apellido_materno=data.apellido_materno,
            correo_institucional=data.correo,
            password_hash=hash_password(data.password),
            career_id=career_id,
            role_id=3,  # estudiante, regla de negocio fija
        )
        creado = self.repo.create(nuevo_usuario)

        return UserResponse(
            matricula=creado.matricula,
            nombre=creado.nombre,
            apellido_paterno=creado.apellido_paterno,
            apellido_materno=creado.apellido_materno,
            correo_institucional=creado.correo_institucional,
            estado=creado.estado,
            foto_perfil=creado.foto_perfil,
            rol="estudiante",
            carrera=data.carrera,
        )

    # ── Paso 3: Login.jsx ────────────────────────────────────────
    def login(self, data: LoginRequest) -> TokenResponse:
        usuario = self.repo.get_by_correo(data.correo)

        if not usuario or not verify_password(data.password, usuario.password_hash):
            if usuario:
                self.repo.incrementar_intentos_fallidos(usuario)
            raise UnauthorizedException("Correo o contraseña incorrectos")

        if usuario.estado != "activo":
            raise ForbiddenException("Tu cuenta no está activa. Contacta al encargado.")

        self.repo.update_login_exitoso(usuario)

        token = create_token({"sub": usuario.matricula, "role": usuario.role.nombre})

        return TokenResponse(
            access_token=token,
            rol=usuario.role.nombre,
            matricula=usuario.matricula,
            nombre=f"{usuario.nombre} {usuario.apellido_paterno} {usuario.apellido_materno or ''}".strip(),
        )