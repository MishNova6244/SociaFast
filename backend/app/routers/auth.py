from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.auth import (
    ValidarCorreoRequest, ValidarCorreoResponse, LoginRequest, TokenResponse,
)
from app.schemas.user import UserCreate, UserResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/validar-correo", response_model=ValidarCorreoResponse)
def validar_correo(data: ValidarCorreoRequest, db: Session = Depends(get_db)):
    return AuthService(db).validar_correo(data.correo)


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(data: UserCreate, db: Session = Depends(get_db)):
    return AuthService(db).register(data)


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    return AuthService(db).login(data)