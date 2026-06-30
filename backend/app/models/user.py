from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base


class User(Base):
    __tablename__ = "usuarios"

    matricula = Column(String(20), primary_key=True, index=True)

    # ── Datos personales ───────────────────────────────────────
    nombre           = Column(String(100), nullable=False)
    apellido_paterno = Column(String(100), nullable=False)
    apellido_materno = Column(String(100), nullable=True)

    # ── Relaciones (FK) ────────────────────────────────────────
    career_id = Column(Integer, ForeignKey("carreras.id"), nullable=False)
    role_id   = Column(Integer, ForeignKey("roles.id"),    nullable=False, default=3)  # 3 = estudiante

    career = relationship("Career", back_populates="usuarios")
    role   = relationship("Role",   back_populates="usuarios")

    # ── Credenciales ───────────────────────────────────────────
    correo_institucional = Column(String(255), unique=True, nullable=False, index=True)
    password_hash         = Column(String(255), nullable=False)

    # ── Control de acceso ──────────────────────────────────────
    estado = Column(String(20), nullable=False, default="activo")  # activo | inactivo | bloqueado

    # ── Perfil y auditoría ──────────────────────────────────────
    foto_perfil       = Column(String(255), nullable=True)
    fecha_creacion    = Column(DateTime(timezone=True), server_default=func.now())
    ultimo_acceso     = Column(DateTime(timezone=True), nullable=True)
    intentos_fallidos = Column(Integer, default=0, nullable=False)