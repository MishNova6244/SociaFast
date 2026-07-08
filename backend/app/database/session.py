from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings  # lee las variables del .env


# ── Motor de conexión ──────────────────────────────────────────
engine = create_engine(
    settings.DATABASE_URL,   # "mysql+pymysql://user:pass@host:port/dbname"
    pool_pre_ping = True,      # verifica que la conexión sigue viva antes de usarla
    pool_recycle = 3600,       # recicla conexiones después de 1 hora (evita timeouts MySQL)
    echo = settings.DEBUG,     # imprime el SQL generado en consola solo si DEBUG=True
)

# ── Fábrica de sesiones ────────────────────────────────────────
SessionLocal = sessionmaker(
    bind = engine,
    autocommit = False,  # los cambios NO se guardan solos, requieren db.commit()
    autoflush = False,   # no envía cambios a MySQL hasta que se llame db.flush() o commit()
)


# ── Generador de sesión para FastAPI ───────────────────────────
def get_db():
    """
    Dependencia inyectable en los routers.
    Abre una sesión, la entrega al endpoint y la cierra al terminar
    sin importar si hubo error o no (bloque finally).
    """
    db = SessionLocal()
    try:
        yield db       # FastAPI usa el valor aquí mientras procesa el request
    finally:
        db.close()     # siempre se ejecuta: éxito, error o excepción