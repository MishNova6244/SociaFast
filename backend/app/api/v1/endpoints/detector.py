from fastapi import APIRouter, UploadFile, File, HTTPException
import requests
import tempfile
import os
from docx import Document
import PyPDF2

router = APIRouter()

SAPLING_API_URL = "https://api.sapling.ai/api/v1/aidetect"
SAPLING_API_KEY = "TU_API_KEY_AQUI"  # reemplaza con tu API Key real


def extraer_texto_docx(file_path: str) -> str:
    doc = Document(file_path)
    texto = "\n".join([p.text for p in doc.paragraphs])
    return texto


def extraer_texto_pdf(file_path: str) -> str:
    texto = ""
    with open(file_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            texto += page.extract_text() + "\n"
    return texto


@router.post("/detector/analizar")
async def analizar_documento(archivo: UploadFile = File(...)):
    try:
        # Guardar archivo temporalmente
        suffix = os.path.splitext(archivo.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(await archivo.read())
            tmp_path = tmp.name

        # Extraer texto según extensión
        if archivo.filename.endswith(".docx"):
            texto = extraer_texto_docx(tmp_path)
        elif archivo.filename.endswith(".pdf"):
            texto = extraer_texto_pdf(tmp_path)
        else:
            raise HTTPException(status_code=400, detail="Formato no soportado")

        # Llamar a la API de Sapling
        response = requests.post(
            SAPLING_API_URL, json={"key": SAPLING_API_KEY, "text": texto}
        )

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Error en Sapling API")

        data = response.json()
        porcentaje = round(data.get("score", 0) * 100)

        conclusion = (
            "Bajo uso de IA detectado. Documento aceptable."
            if porcentaje < 30
            else (
                "Uso moderado de IA detectado. Se recomienda revisión."
                if porcentaje < 60
                else "Alto uso de IA detectado. Documento cuestionable."
            )
        )

        return {"porcentaje": porcentaje, "conclusion": conclusion}

    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
