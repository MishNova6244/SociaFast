from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    # ── Aplicación ─────────────────────────────────────────────
    APP_NAME: str = "SociaFast"
    DEBUG: bool   = True

    # ── Base de datos ──────────────────────────────────────────
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_NAME: str = "servifast"
    DB_USER: str = "root"
    DB_PASSWORD: str = "123456"

    # ── JWT ────────────────────────────────────────────────────
    SECRET_KEY: str = "dev_key_cambiar_en_produccion"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # ── URL de conexión construida desde las variables de arriba ─
    @property
    def DATABASE_URL(self) -> str:
        return (
            f"mysql+pymysql://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )

    model_config = {
        "env_file": ".env",   # lee el archivo .env en la raíz del backend
        "extra": "ignore",    # ignora variables del .env que no estén declaradas aquí
    }


# Instancia única que importan todos los módulos
settings = Settings()