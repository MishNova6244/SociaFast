# app/database/connection.py
"""
Módulo de conexión a MySQL.'
Establece la sesión de base de datos usando SQLAlchemy.
"""

# 1. Importaciones de SQLAlchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# 2. Importaciones de configuración
from dotenv import load_dotenv
import os

# 3. Cargar variables de entorno
load_dotenv()

# 4. Obtener configuración desde .env
MYSQL_HOST = os.getenv("MYSQL_HOST")
MYSQL_PORT = os.getenv("MYSQL_PORT")
MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
MYSQL_DATABASE = os.getenv("MYSQL_DATABASE")

# 5. Construir URL de conexión MySQL
mysql_url = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}"

# 6. Crear el motor de base de datos
engine = create_engine(
    mysql_url,
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=False
)

# 7. Crear fábrica de sesiones
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# 8. Clase base para modelos ORM
Base = declarative_base()

# 9. Función para obtener sesión de DB
def get_db():
    """
    Generador de sesiones de base de datos.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()