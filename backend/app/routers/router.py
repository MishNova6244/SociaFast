from fastapi import APIRouter

from app.routers.auth import router as auth_router
from app.routers.users import router as users_router

# Router principal que agrupa todos los sub-routers
api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth_router)
api_router.include_router(users_router)