# app/services/auth_service.py
"""
Servicio de autenticación.
Maneja hasheo de contraseñas y tokens JWT.
"""

# 1. Utilidades de fecha
from datetime import datetime, timedelta
from typing import Optional

# 2. Para hashear contraseñas - usando bcrypt directamente
import bcrypt

# 3. Para crear tokens JWT
from jose import JWTError, jwt
from dotenv import load_dotenv
import os

# 4. Cargar configuración
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))


# 5. Funciones de contraseña
# -----------------------

def hash_password(password: str) -> str:
    """
    Hashea una contraseña en texto plano.
    Retorna el hash generado.
    """
    # Convertir a bytes
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifica una contraseña contra su hash.
    Retorna True si coinciden, False si no.
    """
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)


# 6. Funciones de JWT
# -------------------

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Crea un token JWT con los datos proporcionados.
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """
    Decodifica un token JWT.
    Retorna los datos si es válido, None si no.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None