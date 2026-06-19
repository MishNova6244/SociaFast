from pydantic import BaseModel


class MessageResponse(BaseModel):
    """Respuesta genérica de confirmación."""
    message: str
    success: bool = True