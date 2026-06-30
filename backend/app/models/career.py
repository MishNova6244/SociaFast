from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database.base import Base


class Career(Base):
    __tablename__ = "carreras"

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(150), unique = True, nullable = False)  # ej. "Ing. en Mecatrónica"
    siglas = Column(String(20), unique=True, nullable=False)   # ej. "mecatronica" (coincide con el <option> del frontend)

    # Una carrera tiene muchos usuarios
    usuarios = relationship("User", back_populates="career")