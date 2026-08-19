"""
Punto de entrada de la aplicación SociaFast.
Configura FastAPI, CORS y registra los routers.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.api.v1.endpoints import detector

from app.core.config import settings
from app.api import api_router

app = FastAPI(
    title=settings.APP_NAME,
    docs_url="/api/docs" if settings.DEBUG else None,  # Swagger solo en desarrollo
    redoc_url=None,
)
app = FastAPI()

app.include_router(detector.router, prefix="/api/v1", tags=["Detector IA"])

# CORS — orígenes permitidos vienen del .env (ALLOWED_ORIGINS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registro de todos los endpoints
app.include_router(api_router)


@app.get("/", tags=["health"])
def health():
    """Endpoint de salud — verifica que el servidor esté corriendo."""
    return {"status": "ok", "app": settings.APP_NAME}
