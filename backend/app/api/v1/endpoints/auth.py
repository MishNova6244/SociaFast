"""
Endpoints de autenticación.
Todas las rutas son públicas (no requieren JWT) excepto donde se indique.

Rutas disponibles:
  POST /api/v1/auth/validate-email   — verifica si el correo puede registrarse
  POST /api/v1/auth/register         — crea una cuenta de estudiante
  POST /api/v1/auth/login            — autentica y devuelve JWT
  POST /api/v1/auth/password/forgot  — envía token de recuperación al correo
  POST /api/v1/auth/password/reset   — valida token y actualiza contraseña
"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.auth import (
    ValidateEmailRequest, ValidateEmailResponse,
    LoginRequest, TokenResponse,
    PasswordResetRequest, PasswordResetConfirm, MessageResponse,
)
from app.schemas.user import UserCreate, UserResponse, SupervisorCreate, AdminCreate
from app.services.auth_service import AuthService

# Prefijo /auth — todas las rutas aquí son /api/v1/auth/...
router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/validate-email", response_model=ValidateEmailResponse)
def validate_email(data: ValidateEmailRequest, db: Session = Depends(get_db)):
    """
    Verifica el correo institucional antes de mostrar el formulario de registro.
    Retorna si es estudiante y si ya tiene cuenta registrada.
    El frontend usa already_registered para mostrar el mensaje correcto.
    """
    return AuthService(db).validate_email(data.email)


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(data: UserCreate, db: Session = Depends(get_db)):
    """
    Registra un nuevo estudiante en el sistema.
    Valida que correo y matrícula no estén duplicados
    y que la matrícula coincida con el prefijo del correo.
    """
    return AuthService(db).register(data)


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    """
    Autentica al usuario y retorna un JWT.
    El token incluye el student_id y el rol del usuario.
    Expira en ACCESS_TOKEN_EXPIRE_MINUTES minutos (configurado en .env).
    """
    return AuthService(db).login(data)


@router.post("/password/forgot", response_model=MessageResponse)
async def forgot_password(data: PasswordResetRequest, db: Session = Depends(get_db)):
    """
    Paso 1 del flujo de recuperación.
    Genera un token de 6 dígitos y lo envía al correo institucional del usuario.
    Siempre responde con éxito aunque el correo no exista — evita revelar qué correos están registrados.
    El token expira en 15 minutos.
    """
    return await AuthService(db).forgot_password(data)


@router.post("/password/reset", response_model=MessageResponse)
async def reset_password(data: PasswordResetConfirm, db: Session = Depends(get_db)):
    """
    Paso 2 del flujo de recuperación.
    Valida el token de 6 dígitos recibido por correo
    y actualiza la contraseña del usuario.
    El token se elimina de la BD después de usarse.
    """
    return await AuthService(db).reset_password(data)


@router.post(
    "/register/supervisor",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_supervisor(data: SupervisorCreate, db: Session = Depends(get_db)):
    """Registra un nuevo encargado en el sistema."""
    return AuthService(db).register_supervisor(data)


@router.post(
    "/register/admin",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_admin(data: AdminCreate, db: Session = Depends(get_db)):
    """Registra un nuevo administrador en el sistema."""
    return AuthService(db).register_admin(data)
