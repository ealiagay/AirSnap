from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from TempoService import procesar_coordenadas

class Coordenadas(BaseModel):
    latitud: float
    longitud: float

app = FastAPI()

@app.get("/")
def read_root():
    return {"mensaje": "API de Coordenadas lista"}

# Versión GET (query parameters)
@app.get("/coordenadas")
def obtener_por_query(latitud: float, longitud: float):
    try:
        resultado = procesar_coordenadas(latitud, longitud)
        return {"latitud": latitud, "longitud": longitud, "resultado": resultado}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Versión POST (body JSON)
@app.post("/coordenadas")
def obtener_por_body(datos: Coordenadas):
    try:
        resultado = procesar_coordenadas(datos.latitud, datos.longitud)
        return {"latitud": datos.latitud, "longitud": datos.longitud, "resultado": resultado}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
