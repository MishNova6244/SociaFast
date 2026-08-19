"""
Configuración compartida para todos los tests.
Define la base de datos en memoria y el cliente de pruebas.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database.base import Base
from app.database.session import get_db
from app.main import app
from app.models import Role, Career, User  # noqa: F401 — necesario para crear tablas

# SQLite en memoria: no requiere MySQL para correr los tests
TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args = {"check_same_thread": False},
    poolclass = StaticPool,  # una sola conexión compartida entre threads
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope = "function")
def db():
    "Crea las tablas, entrega la sesión y las elimina al terminar cada test."
    Base.metadata.create_all(bind = engine)
    session = TestingSessionLocal()

    # Seed mínimo: roles y una carrera
    session.add(Role(id = 1, nombre = "administrador"))
    session.add(Role(id = 2, nombre = "encargado"))
    session.add(Role(id = 3, nombre = "estudiante"))
    session.add(Career(id = 1, nombre = "Ing. en Mecatrónica", siglas = "mecatronica"))
    session.commit()

    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind = engine)

@pytest.fixture(scope = "function")
def client(db):
    "Cliente HTTP de pruebas con la BD de pruebas inyectada."
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()