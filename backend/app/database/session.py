"""
Configuración del motor de base de datos y generador de sesiones.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Motor de conexión a MySQL
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,   # verifica que la conexión sigue viva antes de usarla
    pool_recycle=3600,    # recicla conexiones cada hora para evitar timeouts de MySQL
    echo=settings.DEBUG,  # imprime el SQL en consola solo si DEBUG=True en .env
)

# Fábrica de sesiones — autocommit y autoflush desactivados para control manual
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


def get_db():
    """
    Dependencia inyectable en los endpoints.
    Abre una sesión, la entrega al endpoint y la cierra al terminar,
    sin importar si hubo error o no (bloque finally garantiza el cierre).
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
