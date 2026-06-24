# app/main.py
"""
Punto de entrada de la aplicación FastAPI.
Aquí se configura el servidor, el CORS y se registran todos los endpoints.
"""

# ── Librerías externas ─────────────────────────────────────────────────────────
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# ── Módulos propios del proyecto ───────────────────────────────────────────────
from .database.connection import engine, get_db
from .models.usuario import Usuario, Base as ModeloBase
from .schemas import UsuarioCreate, UsuarioResponse, LoginRequest, TokenResponse
from .services.auth_service import (
    hash_password,
    verify_password,
    create_access_token
)


# ── Inicialización de base de datos ───────────────────────────────────────────
# Crea las tablas automáticamente si no existen
ModeloBase.metadata.create_all(bind=engine)


# ── Instancia principal de FastAPI ────────────────────────────────────────────
app = FastAPI(
    title="ServiFast API",
    description = "API para gestión del servicio social estudiantil",
    version="1.0.0"
)


# ── Configuración de CORS ─────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:5173", "http://localhost:3000"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)


# ══════════════════════════════════════════════════════════════════════
#  ENDPOINTS
# ══════════════════════════════════════════════════════════════════════

@app.get("/")
def inicio():
    """
    GET /
    Ruta de verificación — confirma que el servidor está activo.
    """
    return {
        "mensaje": "ServiFast API funcionando",
        "status": "ok"
    }


# ── Registro de usuario ───────────────────────────────────────────────────────
@app.post(
    "/usuarios/registrar",
    response_model = UsuarioResponse,
    status_code=status.HTTP_201_CREATED
)
def registrar_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    """
    POST /usuarios/registrar
    Crea una cuenta nueva en el sistema.

    Recibe  → { matricula, email, nombre, carrera, password }
    Retorna → datos del usuario creado (sin password)
    Errores → 400 si la matrícula o email ya existe
    """
    # 1. Buscar si ya existe una cuenta con esa matrícula
    usuario_existente = db.query(Usuario).filter(
        Usuario.matricula == usuario.matricula
    ).first()

    if usuario_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail = "La matricula ya esta registrada"
        )

    # 2. Hashear la contraseña (nunca se guarda en texto plano)
    password_hasheado = hash_password(usuario.password)

    # 3. Crear el nuevo usuario
    nuevo_usuario = Usuario(
        matricula=usuario.matricula,
        email=usuario.email,
        nombre=usuario.nombre,
        carrera=usuario.carrera,
        password=password_hasheado,
        rol="estudiante"
    )

    # 4. Guardar en MySQL
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)

    # 5. Devolver el usuario Created
    return nuevo_usuario


# ── Inicio de sesión ─────────────────────────────────────────────────────
@app.post("/usuarios/login", response_model=TokenResponse)
def login_usuario(login: LoginRequest, db: Session = Depends(get_db)):
    """
    POST /usuarios/login
    Autentica al usuario y devuelve un token JWT.

    Recibe  → { email, password }
    Retorna → { access_token, token_type, usuario }
    Errores → 401 si las credenciales son incorrectas
    """
    # 1. Extraer la matrícula del email (ej: A00123456 de A00123456@utpn.edu.mx)
    matricula = login.email.split('@')[0]

    # 2. Buscar al usuario por matrícula
    usuario = db.query(Usuario).filter(
        Usuario.matricula == matricula
    ).first()

    # 3. Validar credenciales
    if not usuario or not verify_password(login.password, usuario.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos",
        )

    # 4. Generar el token JWT
    access_token = create_access_token(
        data={"sub": usuario.matricula, "rol": usuario.rol}
    )

    # 5. Devolver token + datos del usuario
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "usuario": usuario
    }


# ── Consulta de usuario ────────────────────────────────────────────────
@app.get("/usuarios/{matricula}", response_model=UsuarioResponse)
def obtener_usuario(matricula: str, db: Session = Depends(get_db)):
    """
    GET /usuarios/{matricula}
    Devuelve los datos de un usuario específico por su matrícula.
    """
    usuario = db.query(Usuario).filter(Usuario.matricula == matricula).first()

    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )

    return usuario