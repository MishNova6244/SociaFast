"""
Funciones de seguridad centralizadas.
Hashing de contraseñas con bcrypt y manejo de tokens JWT.
Toda la criptografía del sistema pasa por este módulo.
"""
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from app.core.config import settings

# CryptContext con bcrypt — algoritmo estándar para contraseñas
# deprecated="auto" permite migrar hashes viejos automáticamente si se cambia el algoritmo
_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """
    Genera el hash seguro de una contraseña en texto plano.
    El resultado es diferente cada vez aunque la contraseña sea la misma
    porque bcrypt incluye un 'salt' aleatorio interno.
    """
    return _pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    """
    Compara una contraseña en texto plano contra su hash almacenado.
    Retorna True si coinciden, False si no.
    Nunca compares hashes directamente — usa siempre esta función.
    """
    return _pwd_context.verify(plain, hashed)


def create_access_token(data: dict) -> str:
    """
    Genera un JWT firmado con la SECRET_KEY del .env.
    Agrega automáticamente la fecha de expiración al payload.
    El tiempo de vida se configura con ACCESS_TOKEN_EXPIRE_MINUTES en .env.
    """
    payload = {
        **data,
        "exp": datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES),
    }
    # jwt.encode firma el payload con la clave secreta y el algoritmo HS256
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_access_token(token: str) -> dict:
    """
    Decodifica y valida un JWT.
    Lanza JWTError automáticamente si:
    - La firma no coincide con SECRET_KEY
    - El token ya expiró
    - El formato es inválido
    """
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
