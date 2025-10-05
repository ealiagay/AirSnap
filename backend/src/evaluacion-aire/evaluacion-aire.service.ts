import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GeminiService } from '../gemini/gemini.service';
import { PeticionEvaluacionAireDto } from './dto/peticion-evaluacion-aire.dto';

// ======== Tipos exportados (por si los quieres usar fuera) ========
export type DatosAire = {
  aqi: number;
  dioxidonitrogeno: number; // NO2
  hch0: number;             // HCHO (formaldehído)
  pm: number;               // particulado (PM2.5 o mixto)
  origen: 'externo' | 'estatico';
};

export type DatosUsuarioParaInforme = {
  nombre: string;
  fechaNacimiento?: string; // YYYY-MM-DD (opcional)
  // Acepta variantes y ahora también "ninguno"
  enfermedad: string;       // "asma" | "epoc" | "cardiopatia" | "ninguno"
  latitud: number;
  longitud: number;
};

type EnfermedadKey = 'asma' | 'epoc' | 'cardiopatia' | 'ninguno';

@Injectable()
export class EvaluacionAireService {
  constructor(
    private readonly http: HttpService,
    private readonly gemini: GeminiService
  ) {}

  // ===============================
  // CASO 1: Evaluación general
  // ===============================
  async evaluarCalidadAire(dto: PeticionEvaluacionAireDto) {
    const datosAire = await this.obtenerMetricaAire(
      dto.latitud,
      dto.longitud,
      '/predict-calidad-aire'
    );

    const prompt = this.buildPromptGeneral(datosAire);

    let mensaje: string;
    try {
      const respuesta = await this.gemini.preguntar(prompt);
      mensaje = this.enforceMaxChars(respuesta, 100);
    } catch {
      mensaje = this.enforceMaxChars(this.fallbackConsejoGeneral(datosAire.aqi), 100);
    }

    return {
      aqi: datosAire.aqi,
      dioxidonitrogeno: datosAire.dioxidonitrogeno,
      hch0: datosAire.hch0,
      pm: datosAire.pm,
      mensaje,
      origen: datosAire.origen,
    };
  }

  // =========================================
  // CASO 2: Informe personalizado por usuario
  // =========================================
  async generarInforme(datos: DatosUsuarioParaInforme) {
    const metrica = await this.obtenerMetricaAire(
      datos.latitud,
      datos.longitud,
      '/procesar-aire'
    );

    const enfermedadKey = this.normalizarEnfermedad(datos.enfermedad);
    const prompt = this.buildPromptPorEnfermedad(enfermedadKey, {
      nombre: datos.nombre,
      aqi: metrica.aqi,
      no2: metrica.dioxidonitrogeno,
      hcho: metrica.hch0,
      pm: metrica.pm,
    });

    let mensaje: string;
    try {
      const respuesta = await this.gemini.preguntar(prompt);
      mensaje = this.enforceMaxChars(respuesta, 100);
    } catch {
      mensaje = this.enforceMaxChars(
        this.fallbackConsejoPorEnfermedad(enfermedadKey, metrica.aqi),
        100
      );
    }

    return {
      usuario: {
        nombre: datos.nombre,
        enfermedad: enfermedadKey,
        fechaNacimiento: datos.fechaNacimiento ?? null,
      },
      metrica: {
        aqi: metrica.aqi,
        dioxidonitrogeno: metrica.dioxidonitrogeno,
        hch0: metrica.hch0,
        pm: metrica.pm,
        origen: metrica.origen,
      },
      mensaje,
    };
  }

  // ============ Privados comunes ============
  private async obtenerMetricaAire(
    latitud: number,
    longitud: number,
    endpoint: '/predict-calidad-aire' | '/procesar-aire'
  ): Promise<DatosAire> {
    try {
      const { data } = await firstValueFrom(
        this.http.post(endpoint, { latitud, longitud })
      );
      if (!data) throw new Error('Endpoint sin datos');
      return {
        aqi: data.aqi,
        dioxidonitrogeno: data.dioxidonitrogeno,
        hch0: data.hch0,
        pm: data.pm,
        origen: 'externo',
      };
    } catch {
      // Fallback estático si falla el endpoint
      return {
        aqi: 90,
        dioxidonitrogeno: 25,
        hch0: 0.06,
        pm: 45,
        origen: 'estatico',
      };
    }
  }

  private enforceMaxChars(texto: string, max = 100): string {
    if (!texto) return '';
    const plano = texto.replace(/\s+/g, ' ').trim();
    return plano.length <= max ? plano : plano.slice(0, max).trim();
  }

  private normalizarEnfermedad(raw: string): EnfermedadKey {
    const v = (raw || '').trim().toLowerCase();

    // Mapear "ninguno" y variantes comunes
    if (
      v === '' ||
      v.includes('ningun') ||    // ninguno/ninguna
      v.includes('sano') ||      // sano/sana
      v.includes('saludabl') ||  // saludable
      v.includes('ning')         // defensivo adicional
    ) {
      return 'ninguno';
    }

    if (v.includes('epoc') || v.includes('copd')) return 'epoc';
    if (v.includes('cardio') || v.includes('corazon') || v.includes('hipertens'))
      return 'cardiopatia';
    if (v.includes('asma')) return 'asma';

    // Por defecto ahora devolvemos 'ninguno'
    return 'ninguno';
  }

  // ===== Prompts =====
  private buildPromptGeneral({ aqi, dioxidonitrogeno, hch0, pm }: Omit<DatosAire, 'origen'>): string {
    return `
Eres un asistente de salud ambiental.
Valores: AQI=${aqi}, NO₂=${dioxidonitrogeno}, HCHO=${hch0}, PM=${pm}
Escribe un mensaje en español de **máximo 100 caracteres** (no palabras),
con recomendaciones prácticas según el AQI.
Debe ser breve, empático y preventivo.
`.trim();
  }

  private buildPromptPorEnfermedad(
    enfermedad: EnfermedadKey,
    ctx: { nombre: string; aqi: number; no2: number; hcho: number; pm: number }
  ): string {
    const comun = `
Contexto:
- Usuario: ${ctx.nombre}
- Métricas: AQI=${ctx.aqi}, NO₂=${ctx.no2}, HCHO=${ctx.hcho}, PM=${ctx.pm}
Instrucciones:
- Responde en español en **máximo 100 caracteres**.
- Tono empático y preventivo.
- Consejo práctico y accionable para las próximas horas.
- No repitas métricas; enfócate en la recomendación.
`.trim();

    if (enfermedad === 'asma') {
      return `
Eres un educador en salud respiratoria para asma.
${comun}
- Evitar disparadores; manejo de síntomas.
- Limitar ejercicio exterior y tener inhalador a mano.
`.trim();
    }

    if (enfermedad === 'epoc') {
      return `
Eres un educador en salud para EPOC (COPD).
${comun}
- Reducir disnea/exacerbaciones en mala calidad del aire.
- Evitar esfuerzo, mascarilla filtrante si sales, adherencia a medicación.
`.trim();
    }

    if (enfermedad === 'cardiopatia') {
      return `
Eres un educador en salud cardiovascular.
${comun}
- Reducir riesgo por PM/NO₂: limitar exposición y esfuerzo intenso.
- Priorizar interiores ventilados/filtrados y evitar horas pico.
`.trim();
    }

    // ninguno
    return `
Eres un educador en salud ambiental para población general.
${comun}
- Consejo general por AQI: evita horas pico, reduce esfuerzo al aire libre si sube.
- Prioriza interiores ventilados/filtrados cuando el aire esté regular o peor.
`.trim();
  }

  // ===== Fallbacks =====
  private fallbackConsejoGeneral(aqi: number): string {
    if (aqi <= 50)   return 'Aire bueno. Actividad al aire libre sin problema.';
    if (aqi <= 100)  return 'Aire moderado. Sensibles: eviten esfuerzos prolongados.';
    if (aqi <= 150)  return 'Riesgo a sensibles. Limita ejercicio afuera; considera mascarilla.';
    if (aqi <= 200)  return 'Aire malo. Reduce tiempo afuera y ventila interiores.';
    return 'Muy malo. Evita salir y usa mascarilla adecuada si es necesario.';
  }

  private fallbackConsejoPorEnfermedad(
    enfermedad: EnfermedadKey,
    aqi: number
  ): string {
    const leve = aqi <= 100;
    const moderado = aqi > 100 && aqi <= 150;

    if (enfermedad === 'asma') {
      if (leve) return 'Aire aceptable: lleva inhalador y evita polvo/humo.';
      if (moderado) return 'Evita ejercicio afuera; inhalador a mano y mascarilla.';
      return 'Quédate bajo techo; inhalador listo; evita disparadores.';
    }

    if (enfermedad === 'epoc') {
      if (leve) return 'Exposición moderada: evita esfuerzo y sigue medicación.';
      if (moderado) return 'Limita salidas; usa mascarilla filtrante y descansa.';
      return 'Permanece en interiores; usa medicación y evita esfuerzo.';
    }

    if (enfermedad === 'cardiopatia') {
      if (leve) return 'Evita horas pico; actividad suave y prioriza interiores.';
      if (moderado) return 'Limita esfuerzo; permanece en interiores ventilados.';
      return 'Evita salir y esfuerzo intenso; prioriza interiores filtrados.';
    }

    // ninguno (población general)
    if (leve) return 'Aire aceptable. Mantén hábitos y evita humo/polvo innecesario.';
    if (moderado) return 'Aire moderado. Reduce esfuerzos al aire libre y evita horas pico.';
    return 'Aire malo. Prefiere interiores ventilados/filtrados y limita salidas.';
  }
}
