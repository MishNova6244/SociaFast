import uuid

from sqlalchemy import Boolean, Column, Enum, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))

    # Datos personales (coinciden con el formulario Registro.jsx)
    nombre          = Column(String(100), nullable=False)
    apellido_paterno = Column(String(100), nullable=False)
    apellido_materno = Column(String(100), nullable=True)
    matricula       = Column(String(20), unique=True, nullable=False, index=True)
    carrera         = Column(String(100), nullable=False)

    # Credenciales
    email    = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)

    # Control
    role      = Column(
        Enum("estudiante", "encargado", "administrador"),
        nullable=False,
        default="estudiante",
    )
    is_active = Column(Boolean, default=True)

    # Auditoría
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relaciones (se usarán cuando se implemente el módulo de actividades)
    # activities = relationship("Activity", back_populates="student")

    def __repr__(self) -> str:
        return f"<User {self.email} ({self.role})>"