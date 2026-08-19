"""
Modelo de usuario — representa la tabla 'usuarios' en MySQL.
"""
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, SmallInteger
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.constants import STATUS_ACTIVE, ROLE_STUDENT
from app.database.base import Base


class User(Base):
    __tablename__ = "usuarios"

    # Clave primaria
    student_id = Column("matricula", String(20), primary_key=True, index=True)

    # Datos personales
    first_name       = Column("nombre",          String(100), nullable=False)
    paternal_surname = Column("apellido_paterno", String(100), nullable=False)
    maternal_surname = Column("apellido_materno", String(100), nullable=True)

    # Datos académicos — opcionales para encargados y administradores
    career_id    = Column(Integer, ForeignKey("carreras.id"), nullable=True)
    cuatrimestre = Column("cuatrimestre", SmallInteger, nullable=True)
    grupo        = Column("grupo",        String(20),   nullable=True)
    genero       = Column("genero",       String(20),   nullable=True)

    # Actividad asignada al encargado
    actividad_id = Column(Integer, ForeignKey("actividades.id"), nullable=True)

    # Relaciones con catálogos
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False, default=ROLE_STUDENT)
    career  = relationship("Career", back_populates="users")
    role    = relationship("Role",   back_populates="users")

    # Relación con actividad (encargado)
    actividad_encargado = relationship("Actividad", foreign_keys=[actividad_id])

    # Relación con actividad inscrita (alumno)
    actividad_inscrita = relationship("AlumnoActividad", back_populates="alumno", uselist=False)

    # Credenciales
    institutional_email = Column("correo_institucional", String(255), unique=True, nullable=False, index=True)
    password_hash       = Column(String(255), nullable=False)

    # Control de acceso
    status          = Column("estado",           String(20),  nullable=False, default=STATUS_ACTIVE)
    profile_picture = Column("foto_perfil",      String(255), nullable=True)
    created_at      = Column("fecha_creacion",   DateTime(timezone=True), server_default=func.now())
    last_access     = Column("ultimo_acceso",    DateTime(timezone=True), nullable=True)
    failed_attempts = Column("intentos_fallidos", Integer, default=0, nullable=False)

    # Servicio social
    accumulated_hours = Column("horas_acumuladas", Integer, default=0, nullable=False)

    # Recuperación de contraseña
    reset_token         = Column("reset_token",         String(10), nullable=True)
    reset_token_expires = Column("reset_token_expires", DateTime(timezone=True), nullable=True)
