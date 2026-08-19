"""
Repositorio base genérico con operaciones CRUD comunes.
Todos los repositorios específicos (UserRepository, etc.) heredan de esta clase
para no repetir las operaciones básicas de base de datos.

Usa generics de Python (Generic[T]) para que funcione con cualquier modelo
sin perder el tipado — el editor puede autocompletar correctamente.
"""
from typing import Generic, Optional, Type, TypeVar
from sqlalchemy.orm import Session
from app.database.base import Base

# T representa cualquier clase que herede de Base (es decir, cualquier modelo)
T = TypeVar("T", bound=Base)


class BaseRepository(Generic[T]):

    def __init__(self, db: Session, model: Type[T]):
        # db: sesión de SQLAlchemy inyectada por FastAPI con Depends(get_db)
        # model: la clase del modelo (ej. User, Career, Role)
        self.db    = db
        self.model = model

    def get_by_id(self, id) -> Optional[T]:
        """
        Busca un registro por su clave primaria.
        Retorna None si no existe — nunca lanza excepción.
        """
        return self.db.query(self.model).filter(self.model.id == id).first()

    def create(self, instance: T) -> T:
        """
        Inserta un nuevo registro en la BD.
        - add(): agrega el objeto a la sesión pendiente
        - commit(): persiste todos los cambios pendientes en MySQL
        - refresh(): recarga el objeto desde la BD para obtener valores
          generados por MySQL (ej. fecha_creacion con server_default)
        """
        self.db.add(instance)
        self.db.commit()
        self.db.refresh(instance)
        return instance

    def update(self) -> None:
        """
        Persiste los cambios pendientes en la sesión actual.
        Se usa cuando ya modificaste atributos del objeto directamente
        y solo necesitas hacer commit.
        """
        self.db.commit()

    def delete(self, instance: T) -> None:
        """
        Elimina un registro de la BD.
        Hace commit automáticamente — la eliminación es permanente.
        """
        self.db.delete(instance)
        self.db.commit()
