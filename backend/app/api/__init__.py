"""
Registro central de todos los routers de la API.
"""
from fastapi import APIRouter
from app.api.v1.endpoints import auth_router, users_router
from app.api.v1.endpoints.actividades import router as actividades_router
from app.api.v1.endpoints.documentos  import router as documentos_router

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(actividades_router)
api_router.include_router(documentos_router)
