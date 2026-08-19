"""
Constantes globales del sistema.
Punto único de verdad — si un valor cambia, solo se cambia aquí.
"""

# Dominio institucional válido para correos
INSTITUTIONAL_DOMAIN = "@utpn.edu.mx"

# IDs de roles — coinciden con la tabla 'roles' en MySQL
ROLE_ADMIN      = 1
ROLE_SUPERVISOR = 2
ROLE_STUDENT    = 3

# Nombres de roles — coinciden con la columna 'nombre' de la tabla 'roles'
ROLE_ADMIN_NAME      = "administrador"
ROLE_SUPERVISOR_NAME = "encargado"
ROLE_STUDENT_NAME    = "estudiante"

# Estados posibles de un usuario en la tabla 'usuarios'
STATUS_ACTIVE   = "activo"
STATUS_INACTIVE = "inactivo"
STATUS_BLOCKED  = "bloqueado"

# Reglas de negocio del servicio social
MAX_HOURS_PER_TERM = 48  # horas máximas por cuatrimestre
