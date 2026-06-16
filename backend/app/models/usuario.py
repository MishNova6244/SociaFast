# app/models/usuarios.py
"""
Modelo ORM para la tabla de usuarios.
Define la estructura de la tabla en MySQL.
"""

# Column → tipo de dato para cada campo de la tabla
from sqlalchemy import Column, String

# Base → clase padre de SQLAlchemy para crear modelos
from ..database.connection import Base


# Definición del modelo Usuario
class Usuario(Base):
    """
    Modelo de usuario para el servicio social.
    La matrícula es la clave primaria única.
    """
    # Nombre de la tabla en MySQL
    __tablename__ = "usuarios"

    # ── Columnas de la tabla ─────────────────────────────────────────────────────
    
    # Matrícula como clave primaria (ej: A00123456)
    # Es única para cada estudiante
    matricula = Column(String(20), primary_key=True, index=True)
    
    # Email institucional completo (ej: A00123456@utpn.edu.mx)
    # Se usa para iniciar sesión
    email = Column(String(100), nullable=False)
    
    # Nombre completo del estudiante
    # Ejemplo: Juan Perez Garcia
    nombre = Column(String(100), nullable=False)
    
    # Carrera que cursa el estudiante
    # Ejemplo: Ingenieria en Sistemas
    carrera = Column(String(100), nullable=False)
    
    # Contraseña hasheada (nunca en texto plano)
    # Se guarda como hash bcrypt, ej: $2b$12$...
    password = Column(String(255), nullable=False)
    
    # Rol del usuario en el sistema
    # Valores posibles: estudiante, docente, administrador
    rol = Column(String(20), default="estudiante")