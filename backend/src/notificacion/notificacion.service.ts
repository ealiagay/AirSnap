// src/notificacion/notificacion.service.ts
import { Injectable } from "@nestjs/common";
import { EmailService } from "../email/email.service";
import { GeminiService } from "../gemini/gemini.service";

@Injectable()
export class NotificacionService {
  constructor(
    private readonly email: EmailService,
    private readonly geminiService: GeminiService
  ) {}

  // Método simple para hacer pregunta a Gemini
  async preguntarGemini(pregunta: string): Promise<string> {
    return await this.geminiService.preguntar(pregunta);
  }

  // Tu método existente de bienvenida
  private htmlBienvenida(nombre: string) {
    return `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;padding:16px">
        <h2 style="margin:0 0 12px">¡Bienvenido a Inventario App, ${nombre}!</h2>
        <p>Nos alegra tenerte con nosotros. Desde hoy podrás gestionar tu inventario de forma sencilla.</p>
        <div style="margin:16px 0;padding:12px;border:1px solid #eee;border-radius:8px">
          <p style="margin:0">Si tienes dudas, responde este correo o visita la sección de ayuda.</p>
        </div>
        <p style="color:#666;font-size:12px;margin-top:24px">
          © ${new Date().getFullYear()} Inventario App
        </p>
      </div>
    `;
  }

  async enviarBienvenida(to: string, nombre: string) {
    const html = this.htmlBienvenida(nombre);

    return this.email.send({
      to,
      subject: "¡Bienvenido a Inventario App!",
      html,
      text: `Bienvenido a Inventario App, ${nombre}!`,
    });
  }
}