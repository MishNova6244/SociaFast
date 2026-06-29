from sqlalchemy import Boolean, Column, DateTime, Enum, Integer, String
from sqlalchemy.sql import func

from app.database.base import Base


class User(Base):
    __tablename__ = "usuarios"  

    # ── Clave primaria ─────────────────────────────────────────
    matricula = Column(String(20), primary_key=True, index=True)

    # ── Datos personales ───────────────────────────────────────
    nombre            = Column(String(100), nullable = False)
    apellido_paterno  = Column(String(100), nullable = False)
    apellido_materno  = Column(String(100), nullable = True)
    carrera           = Column(String(100), nullable = False)

    # ── Credenciales ───────────────────────────────────────────
    correo_institucional = Column(String(255), unique=True, nullable=False, index=True)
    password_hash        = Column(String(255), nullable=False)

    # ── Control de acceso ──────────────────────────────────────
    rol    = Column(Enum("estudiante", "encargado", "administrador"), nullable=False, default="estudiante")
    estado = Column(Enum("activo", "inactivo", "bloqueado"),          nullable=False, default="activo")

    # ── Perfil ─────────────────────────────────────────────────
    foto_perfil = Column(String(255), nullable = True)  # ruta o URL de la imagen

    # ── Auditoría ──────────────────────────────────────────────
    fecha_creacion    = Column(DateTime(timezone = True), server_default = func.now())
    ultimo_acceso     = Column(DateTime(timezone = True), nullable = True)
    intentos_fallidos = Column(Integer, default = 0, nullable = False)