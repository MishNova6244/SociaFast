from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database.base import Base

class Role(Base):
    __tablename__ = "roles"

    # IDs fijos: 1=admin, 2=supervisor, 3=student
    id = Column(Integer, primary_key = True)
    name = Column("nombre", String(20), unique = True, nullable = False)  # BD: nombre → code: name

    users = relationship("User", back_populates="role")