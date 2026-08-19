from sqlalchemy import (
    Column, 
    DateTime, 
    Enum, 
    ForeignKey, 
    Integer, 
    String, 
    Text
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.base import Base

class ServiceValidation(Base):
    
    __tablename__ = "service_validations"

    id = Column(
        Integer, 
        primary_key=True, 
        autoincrement=True,
    )
    student_id = Column(
        String(20), 
        ForeignKey("usuarios.matricula"), 
        nullable=False
    )
    supervisor_id = Column(String(20), ForeignKey("usuarios.matricula"), nullable=False)

    # Etapa del servicio social que se valida
    stage = Column(Enum("hours", "evidences", "report", "final"), nullable=False)
    status = Column(Enum("pending", "approved", "rejected"), nullable=False, default="pending")

    comments = Column(Text, nullable=True)
    validated_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    student = relationship("User", foreign_keys=[student_id],    backref="validations_received")
    supervisor = relationship("User", foreign_keys=[supervisor_id], backref="validations_given")