from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # ── App ──────────────────────────────────────────────────
    APP_NAME: str = "SociaFast"
    DEBUG: bool = False

    # ── Base de datos — valores DEBEN venir del .env ──────────
    DB_HOST:     str
    DB_PORT:     int = 3306
    DB_NAME:     str
    DB_USER:     str
    DB_PASSWORD: str

    # ── JWT — SECRET_KEY debe venir del .env ──────────────────
    SECRET_KEY:                    str
    ALGORITHM:                     str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES:   int = 20
    RESET_TOKEN_EXPIRE_MINUTES:    int = 15

    # ── CORS ──────────────────────────────────────────────────
    ALLOWED_ORIGINS: str = "http://localhost:5173"

    # ── Email SMTP (Gmail) ────────────────────────────────────
    # Sin credenciales: modo simulado en consola (desarrollo)
    # Con credenciales: envío real via Gmail SMTP puerto 587
    MAIL_USERNAME:  str = ""
    MAIL_PASSWORD:  str = ""
    MAIL_FROM:      str = ""
    MAIL_FROM_NAME: str = "SociaFast"
    MAIL_SERVER:    str = "smtp.gmail.com"
    MAIL_PORT:      int = 587

    @property
    def DATABASE_URL(self) -> str:
        return (
            f"mysql+pymysql://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )

    @property
    def CORS_ORIGINS(self) -> list[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",")]

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
