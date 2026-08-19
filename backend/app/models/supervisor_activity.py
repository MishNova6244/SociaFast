from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from app.database.base import Base

class SupervisorActivity(Base):
    __tablename__ = "supervisor_activities"

    id = Column(Integer, primary_key=True, autoincrement=True)
    supervisor_id = Column("supervisor_id", String(20), ForeignKey("usuarios.matricula"), nullable=False)
    activity_name = Column("activity_name", String(100), nullable=False)

    # Encargado asignado a esta actividad
    supervisor = relationship("User", foreign_keys=[supervisor_id], backref="assigned_activities")