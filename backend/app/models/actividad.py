"""
Modelos de actividades extracurriculares.
Tres tablas: actividades, actividad_horarios y alumno_actividad.
"""
from sqlalchemy import Boolean, Column, DateTime, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base


class Actividad(Base):
    __tablename__ = "actividades"

    id           = Column(Integer, primary_key=True, autoincrement=True)
    nombre       = Column(String(150), nullable=False)
    tipo         = Column(Enum("deporte", "cultural", "programa"), nullable=False)
    lugar        = Column(String(150), nullable=True)   # deportes y culturales
    encargado    = Column(String(150), nullable=True)   # programas
    departamento = Column(String(150), nullable=True)   # programas
    activa       = Column(Boolean, nullable=False, default=True)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())

    # Relaciones
    horarios  = relationship("ActividadHorario", back_populates="actividad", cascade="all, delete-orphan")
    alumnos   = relationship("AlumnoActividad",  back_populates="actividad", cascade="all, delete-orphan")


class ActividadHorario(Base):
    __tablename__ = "actividad_horarios"

    id           = Column(Integer, primary_key=True, autoincrement=True)
    actividad_id = Column(Integer, ForeignKey("actividades.id", ondelete="CASCADE"), nullable=False)
    dia          = Column(String(20), nullable=False)
    hora         = Column(String(50), nullable=False)

    actividad = relationship("Actividad", back_populates="horarios")


class AlumnoActividad(Base):
    __tablename__ = "alumno_actividad"

    id           = Column(Integer, primary_key=True, autoincrement=True)
    student_id   = Column(String(20), ForeignKey("usuarios.matricula", ondelete="CASCADE"), nullable=False)
    actividad_id = Column(Integer, ForeignKey("actividades.id", ondelete="CASCADE"), nullable=False)
    periodo      = Column(String(50), nullable=True)
    fecha_alta   = Column(DateTime(timezone=True), server_default=func.now())

    # Relaciones
    actividad = relationship("Actividad", back_populates="alumnos")
    alumno    = relationship("User", back_populates="actividad_inscrita")
