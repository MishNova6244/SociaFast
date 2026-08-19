"""
Importar todos los modelos aquí para que SQLAlchemy los registre
al arrancar la aplicación. El orden importa: Role y Career antes de User.
"""
from app.models.role import Role
from app.models.career import Career
from app.models.user import User
from app.models.actividad import Actividad, ActividadHorario, AlumnoActividad
from app.models.service_validation import ServiceValidation
