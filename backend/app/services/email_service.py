"""
Servicio de envío de correos institucionales.
Los templates HTML viven en app/templates/emails/ — separados del código Python.
Sin credenciales SMTP: simula el envío en consola (modo desarrollo).
"""
import os
import re
import aiosmtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from app.core.config import settings

EMAILS_DIR = os.path.join(os.path.dirname(__file__), "..", "templates", "emails")


def _cargar_template(nombre: str, variables: dict) -> str:
    """Lee un template HTML y reemplaza {{variable}} con los valores dados."""
    ruta = os.path.join(EMAILS_DIR, nombre)
    with open(ruta, encoding="utf-8") as f:
        html = f.read()
    for clave, valor in variables.items():
        html = html.replace(f"{{{{{clave}}}}}", str(valor))
    return html


async def _send(to_email: str, subject: str, html_body: str) -> None:
    """Envía un correo. Sin credenciales: imprime en consola."""
    if not settings.MAIL_USERNAME or not settings.MAIL_PASSWORD:
        texto = re.sub(r"<[^>]+>", "", html_body)
        print(f"\n{'='*60}\n[EMAIL SIMULADO] Para: {to_email}\nAsunto: {subject}\n{texto.strip()}\n{'='*60}\n")
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"], msg["From"], msg["To"] = subject, settings.MAIL_FROM, to_email
    msg.attach(MIMEText(html_body, "html"))
    await aiosmtplib.send(
        msg, hostname=settings.MAIL_SERVER, port=settings.MAIL_PORT,
        username=settings.MAIL_USERNAME, password=settings.MAIL_PASSWORD,
        start_tls=True,
    )


class EmailService:

    async def send_password_reset(self, to_email: str, token: str, name: str) -> None:
        """Envía el token de 6 dígitos al correo institucional."""
        html = _cargar_template("password_reset.html", {"name": name, "token": token})
        await _send(to_email, "SociaFast — Recuperación de contraseña", html)

    async def send_password_changed(self, to_email: str, name: str) -> None:
        """Notifica que la contraseña fue cambiada exitosamente."""
        html = _cargar_template("password_changed.html", {"name": name})
        await _send(to_email, "SociaFast — Contraseña actualizada", html)
