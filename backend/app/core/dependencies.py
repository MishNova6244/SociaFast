from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session

from app.core.exceptions import UnauthorizedException, ForbiddenException
from app.core.security import decode_token
from app.database.session import get_db  # noqa: F401  (re-exportado para comodidad)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    """Dependencia que extrae y valida el usuario del JWT."""
    from app.models.user import User  # import local para evitar circular

    try:
        payload = decode_token(token)
        user_id: str = payload.get("sub")
        if not user_id:
            raise UnauthorizedException("Token sin identificador de usuario")
    except JWTError:
        raise UnauthorizedException("Token inválido o expirado")

    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise UnauthorizedException("Usuario no encontrado o inactivo")

    return user


def require_role(*roles: str):
    """Factory que devuelve una dependencia que valida el rol del usuario."""
    def checker(current_user=Depends(get_current_user)):
        if current_user.role not in roles:
            raise ForbiddenException(
                f"Se requiere uno de los roles: {', '.join(roles)}"
            )
        return current_user
    return checker


# Guards listos para usar en los routers
get_student   = require_role("estudiante")
get_encargado = require_role("encargado", "administrador")
get_admin     = require_role("administrador")