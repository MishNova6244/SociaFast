from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,      # verifica la conexión antes de usar
    pool_recycle=3600,       # recicla conexiones cada hora
    echo=settings.DEBUG,     # imprime SQL en consola solo en DEBUG
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """Generador de sesión para inyección de dependencias en FastAPI."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()