from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session

from app.core.exceptions import UnauthorizedException, ForbiddenException
from app.core.security import decode_token
from app.database.session import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    """Extrae y valida el usuario desde el JWT en cada request protegido."""
    try:
        payload = decode_token(token)
        matricula: str = payload.get("sub")
        if not matricula:
            raise UnauthorizedException("Token sin identificador")
    except JWTError:
        raise UnauthorizedException("Token inválido o expirado")

    # Import local para evitar circular import
    from app.models.user import User
    user = db.query(User).filter(User.matricula == matricula).first()

    if not user:
        raise UnauthorizedException("Usuario no encontrado")
    if user.estado != "activo":
        raise ForbiddenException("Cuenta inactiva")

    return user


def require_role(*roles: str):
    """Guard de rol reutilizable para cualquier endpoint futuro."""
    def checker(current_user=Depends(get_current_user)):
        if current_user.role.nombre not in roles:
            raise ForbiddenException(f"Se requiere rol: {', '.join(roles)}")
        return current_user
    return checker


# Guards listos para importar en cualquier router
get_student   = require_role("estudiante")
get_encargado = require_role("encargado", "administrador")
get_admin     = require_role("administrador")