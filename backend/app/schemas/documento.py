"""Schemas para generación de documentos."""
from pydantic import BaseModel
from typing import Optional


class ReporteForm(BaseModel):
    """Datos del formulario del alumno para generar documentos."""
    telefono:      str
    institucion:   str
    direccion:     Optional[str] = ""
    tel_institucion: Optional[str] = ""
    supervisor:    Optional[str] = ""
    fecha_inicio:  str
    fecha_fin:     str
    programa:      Optional[str] = ""
    hora_entrada:  Optional[str] = ""
    hora_salida:   Optional[str] = ""
    actividades:   Optional[str] = ""


class EvaluacionForm(BaseModel):
    """Datos del formulario de evaluación de desempeño — lo llena el encargado."""
    fecha:                    Optional[str] = ""
    institucion:              str
    direccion:                Optional[str] = ""
    tel_institucion:          Optional[str] = ""
    supervisor:               str
    dias_modalidad:           Optional[str] = ""
    cumple_horario:           Optional[str] = ""
    supervisa_entrada_salida: Optional[str] = ""
    firma_horas_semanales:    Optional[str] = ""
    reporte_final:            Optional[str] = ""
    acato_reglamento:         Optional[str] = ""
    acato_reglamento_porque:  Optional[str] = ""
    labores_eficientes:       Optional[str] = ""
    labores_eficientes_porque: Optional[str] = ""
    actividades_relevantes:   Optional[str] = ""
    nivel_relevancia:         Optional[str] = ""
    retribuye_formacion:      Optional[str] = ""
    calificacion:             Optional[str] = ""
    calificacion_porque:      Optional[str] = ""
