from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App
    APP_NAME: str = "SociaFastDemo"
    DEBUG: bool = True

    # Base de datos
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_NAME: str = "sociafast_db"
    DB_USER: str = "root"
    DB_PASSWORD: str = ""

    # JWT
    SECRET_KEY: str = "dev_secret_key_cambia_en_produccion"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    @property
    def DATABASE_URL(self) -> str:
        return (
            f"mysql+pymysql://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()