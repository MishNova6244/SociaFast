# app/main.py 
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import auth, users, activities, evidences, reports

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    docs_url="/api/docs" if settings.DEBUG else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PREFIX = "/api/v1"
app.include_router(auth.router,        prefix=PREFIX)
app.include_router(users.router,       prefix=PREFIX)
app.include_router(activities.router,  prefix=PREFIX)
app.include_router(evidences.router,   prefix=PREFIX)
app.include_router(reports.router,     prefix=PREFIX)