import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { PeticionEvaluacionAireDto } from "./dto/peticion-evaluacion-aire.dto";
import { GeminiService } from "../gemini/gemini.service";

type DatosAire = {
  aqi: number;
  dioxidonitrogeno: number;
  hch0: number;
  pm: number;
  origen: "externo" | "estatico";
};

@Injectable()
export class EvaluacionAireService {
  constructor(
    private readonly http: HttpService,
    private readonly gemini: GeminiService
  ) {}

  async evaluarCalidadAire(dto: PeticionEvaluacionAireDto) {
    let datosAire: DatosAire;

    try {
      // 1️⃣ Intentar obtener datos reales del endpoint externo
      const { data } = await firstValueFrom(
        this.http.post("/predict-calidad-aire", {
          latitud: dto.latitud,
          longitud: dto.longitud,
        })
      );

      if (!data) throw new Error("El endpoint no devolvió datos");

      datosAire = {
        aqi: data.aqi,
        dioxidonitrogeno: data.dioxidonitrogeno,
        hch0: data.hch0,
        pm: data.pm,
        origen: "externo",
      };
    } catch (error: unknown) {
      console.warn(
        "⚠️ Error al consultar el endpoint externo. Usando datos estáticos."
      );
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(error);
      }

      // 2️⃣ Datos estáticos de respaldo
      datosAire = {
        aqi: 82,
        dioxidonitrogeno: 18,
        hch0: 0.04,
        pm: 39,
        origen: "estatico",
      };
    }

    // 3️⃣ Generar mensaje con Gemini (usa tu GeminiService existente)
    const prompt = this.buildPrompt(datosAire);

    let mensaje: string;
    try {
      mensaje = await this.gemini.preguntar(prompt);
    } catch (error: unknown) {
      console.warn("⚠️ Error consultando Gemini. Usando mensaje de respaldo.");
      if (error instanceof Error) console.error(error.message);
      else console.error(error);
      mensaje = this.fallbackConsejo(datosAire.aqi);
    }

    // 4️⃣ Respuesta al frontend
    return {
      aqi: datosAire.aqi,
      dioxidonitrogeno: datosAire.dioxidonitrogeno,
      hch0: datosAire.hch0,
      pm: datosAire.pm,
      mensaje,
      origen: datosAire.origen,
    };
  }

  private buildPrompt({
    aqi,
    dioxidonitrogeno,
    hch0,
    pm,
  }: Omit<DatosAire, "origen">): string {
    return `
Eres un asistente de salud ambiental.
Estos son los valores medidos:
- AQI: ${aqi}
- Dióxido de nitrógeno (NO₂): ${dioxidonitrogeno}
- HCHO (formaldehído): ${hch0}
- PM (materia particulada): ${pm}

Escribe un mensaje en español de **máximo 100 caracteres** (no palabras),
con recomendaciones prácticas según el nivel de AQI.
Debe ser breve, empático y preventivo.
Ejemplo: "Evita salir hoy, el aire está contaminado".
`.trim();
  }

  private fallbackConsejo(aqi: number): string {
    if (aqi <= 50) {
      return "La calidad del aire es buena. Puedes realizar actividades al aire libre sin problema.";
    } else if (aqi <= 100) {
      return "La calidad del aire es moderada. Personas sensibles deberían evitar esfuerzos prolongados al aire libre.";
    } else if (aqi <= 150) {
      return "La calidad del aire puede afectar a grupos sensibles. Limita actividad intensa al aire libre y considera mascarilla.";
    } else if (aqi <= 200) {
      return "La calidad del aire es mala. Reduce el tiempo al aire libre y mantén interiores ventilados.";
    } else {
      return "La calidad del aire es muy mala. Evita salir y usa mascarilla adecuada si es necesario.";
    }
  }
}
