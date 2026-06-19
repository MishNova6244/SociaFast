from app.core.config import settings
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.dependencies import get_current_user, get_student, get_encargado, get_admin
from app.core.exceptions import (
    NotFoundException,
    UnauthorizedException,
    ForbiddenException,
    ConflictException,
)