// src/notificacion/notificacion.controller.ts
import { Controller, Post, Body, Get, Query } from "@nestjs/common";
import { NotificacionService } from "./notificacion.service";

@Controller("notificaciones")
export class NotificacionController {
  constructor(private readonly svc: NotificacionService) {}

  @Post("pregunta")
  async pregunta(@Body() body: { pregunta: string }) {
    try {
      const respuesta = await this.svc.preguntarGemini(body.pregunta);
      return {
        ok: true,
        pregunta: body.pregunta,
        respuesta: respuesta,
      };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Error desconocido',  // 👈 CAMBIAR ESTA LÍNEA
      };
    }
  }

  @Get("test")
  async test(@Query("texto") texto: string) {
    try {
      const respuesta = await this.svc.preguntarGemini(texto || "Hola");
      return {
        ok: true,
        pregunta: texto,
        respuesta: respuesta,
      };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : 'Error desconocido',  // 👈 CAMBIAR ESTA LÍNEA
      };
    }
  }
}