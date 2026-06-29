from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    
    """
    Clase base que heredan TODOS los modelos del proyecto.
    SQLAlchemy la usa para registrar las tablas y sus columnas.
    """
    pass