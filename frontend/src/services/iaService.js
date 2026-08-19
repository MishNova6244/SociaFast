// Servicio compartido para extracción de texto y análisis con Sapling
import * as pdfjsLib from "pdfjs-dist"
import mammoth from "mammoth"

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export async function extraerTexto(file) {
  const extension = file.name.split(".").pop().toLowerCase()

  if (extension === "pdf") {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    let texto = ""
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      texto += content.items.map((item) => item.str).join(" ") + "\n"
    }
    return texto
  }

  if (extension === "docx") {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    return result.value
  }

  throw new Error("Formato no soportado")
}

export async function analizarTexto(texto) {
  const response = await fetch("https://api.sapling.ai/api/v1/aidetect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key: "TU_API_KEY_AQUI", // reemplaza con tu API Key real
      text: texto
    })
  })

  const data = await response.json()
  const porcentaje = Math.round(data.score * 100)

  return {
    porcentaje,
    conclusion:
      porcentaje < 30
        ? "Bajo uso de IA detectado. Documento aceptable."
        : porcentaje < 60
        ? "Uso moderado de IA detectado. Se recomienda revisión."
        : "Alto uso de IA detectado. Documento cuestionable."
  }
}