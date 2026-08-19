"""
Dependencias inyectables de FastAPI.
Se usan con Depends() en los endpoints para autenticar al usuario
y verificar que tiene el rol necesario para acceder a cada ruta.

Ejemplo de uso en un endpoint:
    @router.get("/me")
    def get_me(current_user: User = Depends(get_current_user)):
        ...
"""
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session

from app.core.constants import STATUS_ACTIVE, ROLE_STUDENT_NAME, ROLE_SUPERVISOR_NAME, ROLE_ADMIN_NAME
from app.core.exceptions import UnauthorizedException, ForbiddenException
from app.core.security import decode_access_token
from app.database.session import get_db
from app.models.user import User

# Le indica a FastAPI que los endpoints protegidos esperan un Bearer token
# en el header: Authorization: Bearer <token>
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Dependencia principal de autenticación.
    1. Extrae el JWT del header Authorization
    2. Lo decodifica y valida con decode_access_token()
    3. Busca al usuario en la BD por su student_id (campo 'sub' del token)
    4. Verifica que la cuenta esté activa

    Lanza 401 si el token es inválido o el usuario no existe.
    Lanza 403 si la cuenta está inactiva.
    """
    try:
        payload = decode_access_token(token)
        user_id = payload.get("sub")
        if not user_id:
            raise UnauthorizedException("Token sin identificador de usuario")
    except JWTError:
        raise UnauthorizedException("Token inválido o expirado")

    # Busca al usuario en la BD — si fue eliminado después de emitir el token, lanza 401
    user = db.query(User).filter(User.student_id == user_id).first()
    if not user:
        raise UnauthorizedException("Usuario no encontrado")

    # Verifica que la cuenta esté activa — un admin puede desactivarla
    if user.status != STATUS_ACTIVE:
        raise ForbiddenException("Cuenta inactiva. Contacta al administrador.")

    return user


def require_role(*roles: str):
    """
    Fábrica de dependencias para control de acceso por rol.
    Retorna una dependencia que verifica que el usuario autenticado
    tenga alguno de los roles especificados.

    Uso:
        # Solo administradores
        @router.post("/users")
        def create_user(user = Depends(get_admin)):
            ...

        # Administradores o encargados
        @router.get("/students")
        def list_students(user = Depends(get_supervisor)):
            ...
    """
    def checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role.name not in roles:
            raise ForbiddenException(
                f"Acceso denegado. Se requiere rol: {', '.join(roles)}"
            )
        return current_user
    return checker


# ── Guards listos para usar directamente con Depends() ────────────────────────

# Solo estudiantes
get_student = require_role(ROLE_STUDENT_NAME)

# Encargados y administradores (admin puede hacer todo lo que hace el encargado)
get_supervisor = require_role(ROLE_SUPERVISOR_NAME, ROLE_ADMIN_NAME)

# Solo administradores
get_admin = require_role(ROLE_ADMIN_NAME)
