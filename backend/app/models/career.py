from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database.base import Base

class Career(Base):
    __tablename__ = "carreras"

    id = Column(Integer, primary_key=True, autoincrement = True)
    name = Column("nombre", String(150), unique=True, nullable = False)
    slug = Column("siglas", String(20),  unique=True, nullable = False)

    users = relationship("User", back_populates="career")