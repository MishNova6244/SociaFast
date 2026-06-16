# backend/app/config.py
"""
Configuración global de la aplicación.
Carga las variables de entorno y provee valores por defecto.
"""

# ── Librerías externas ─────────────────────────────────────────────────────────
from functools import lru_cache

# dotenv → carga variables desde archivo .env
from dotenv import load_dotenv

# os → acceder a variables de entorno
import os

# ── Cargar variables de entorno ────────────────────────────────────────────────
load_dotenv()


# ── Configuración de la aplicación ──────────────────────────────────────────
class Settings:
    """
    Configuración de la aplicación.
    Se cargan desde variables de entorno.
    """
    
    # ── Información de la app ─────────────────────────────────────────────
    APP_NAME: str = "ServiFast"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "API para gestión del servicio social estudiantil"
    
    # ── MySQL ────────────────────────────────────────────────────────────────
    MYSQL_HOST: str = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT: int = int(os.getenv("MYSQL_PORT", 3306))
    MYSQL_USER: str = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD: str = os.getenv("MYSQL_PASSWORD", "root")
    MYSQL_DATABASE: str = os.getenv("MYSQL_DATABASE", "servifast")
    
    # ── JWT ────────────────────────────────────────────────────────────────
    SECRET_KEY: str = os.getenv("SECRET_KEY", "tu-clave-secreta-aqui")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
    
    # ── CORS ────────────────────────────────────────────────────────────────
    BACKEND_CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000"]


# ── Instancia global ─────────────────────────────────────────────────────────
@lru_cache()
def get_settings() -> Settings:
    """
    Retorna una instancia cacheada de la configuración.
    Evita recargar las settings en cada-request.
    """
    return Settings()
# Acceso rápido a la configuración
settings = get_settings()