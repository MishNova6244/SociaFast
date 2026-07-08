from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database.base import Base


class Role(Base):
    __tablename__ = "roles"

    # 1 = administrador, 2 = encargado, 3 = estudiante (datos fijos, precargados)
    id = Column(Integer, primary_key=True)
    nombre = Column(String(20), unique=True, nullable=False)

    # Un rol tiene muchos usuarios; no se carga en cascada por defecto
    usuarios = relationship("User", back_populates="role")