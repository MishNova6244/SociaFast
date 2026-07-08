from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers.router import api_router

app = FastAPI(
    title=settings.APP_NAME,
    docs_url="/api/docs",
    redoc_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://wxh98t5h-5173.usw3.devtunnels.ms",  # tu URL del tunnel frontend
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/", tags=["health"])
def health():
    return {"status": "ok", "app": settings.APP_NAME}