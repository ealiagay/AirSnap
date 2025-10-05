import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { UsuariosRepository } from "../repositories/usuarios.repository";
import { CrearUsuarioDto } from "../dtos/crear-usuario.dto";
import { ActualizarUsuarioDto } from "../dtos/actualizar-usuario.dto";
import { EvaluacionAireService } from "@/evaluacion-aire/evaluacion-aire.service";
import { EmailService } from "@/email/email.service"; // 👈 usamos EmailService directo

@Injectable()
export class UsuariosService {
  private readonly logger = new Logger(UsuariosService.name);

  constructor(
    private readonly repo: UsuariosRepository,
    private readonly informeAireService: EvaluacionAireService,
    private readonly email: EmailService // 👈 inyectamos email
  ) {}

  // 📋 CRUD BÁSICO
  listar(params?: { page?: number; limit?: number }) {
    return this.repo.listar(params?.page, params?.limit);
  }

  obtenerPorId(id: string) {
    return this.repo.obtenerPorId(id);
  }

  crear(dto: CrearUsuarioDto) {
    return this.repo.crear(dto);
  }

  actualizar(id: string, dto: ActualizarUsuarioDto) {
    return this.repo.actualizar(id, dto);
  }

  eliminar(id: string) {
    return this.repo.eliminar(id);
  }
  //@Cron("0 7 * * 1", { timeZone: "America/La_Paz" })
  @Cron('35 3 * * *', { timeZone: 'America/La_Paz' })
  async generarReportesAutomaticos() {
    this.logger.log(
      "🚀 Iniciando generación y envío de reportes de calidad del aire…"
    );

    const { data: usuarios } = await this.repo.listar(1, 1000);
    if (!usuarios.length) {
      this.logger.warn("⚠️ No hay usuarios registrados para generar reportes.");
      return;
    }

    for (const usuario of usuarios) {
      try {
        // 1) Generar informe
        console.log(usuario)
        const informe = await this.informeAireService.generarInforme({
          nombre: usuario.nombreCompleto,
          fechaNacimiento: usuario.fechaNacimiento?.toString() ?? "",
          enfermedad: usuario.enfermedad ?? "ninguno",
          latitud: Number(usuario.latitud),
          longitud: Number(usuario.longitud),
        });

        this.logger.log(
          `✅ Informe generado para ${usuario.nombreCompleto}: ${informe.mensaje}`
        );

        // 2) Construir email (HTML + texto plano)
        const { html, text, subject } = this.armarCorreoInforme(informe);

        // 3) Enviar email
        await this.email.send({
          to: usuario.correoElectronico,
          subject,
          html,
          text,
        });

        this.logger.log(`📧 Informe enviado a ${usuario.correoElectronico}`);
      } catch (error) {
        this.logger.error(
          `❌ Error al generar/enviar informe para ${usuario.nombreCompleto}`,
          error instanceof Error ? error.message : String(error)
        );
      }
    }

    this.logger.log("📨 Finalizó la generación y envío de reportes.");
  }

  // ---------- Privados ----------

  /** Arma el contenido del correo del informe */
  private armarCorreoInforme(informe: {
    usuario: { nombre: string; enfermedad: string | null };
    metrica: {
      aqi: number;
      dioxidonitrogeno: number;
      hch0: number;
      pm: number;
      origen: string;
    };
    mensaje: string;
  }) {
    const fecha = new Date();
    const subject = `Informe de calidad del aire - ${fecha.toLocaleDateString(
      "es-BO"
    )}`;

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;padding:16px">
        <h2 style="color:#2a7a5e;margin-bottom:8px;">Hola ${informe.usuario.nombre} 🌤️</h2>
        <p style="margin:0 0 12px;">${informe.mensaje}</p>

        <div style="margin-top:16px;padding:12px;border:1px solid #e0e0e0;border-radius:8px;background:#fafafa">
          <h3 style="margin:0 0 8px">📊 Detalles de la calidad del aire:</h3>
          <ul style="margin:0;padding-left:18px">
            <li><b>AQI:</b> ${informe.metrica.aqi}</li>
            <li><b>NO₂:</b> ${informe.metrica.dioxidonitrogeno}</li>
            <li><b>HCHO:</b> ${informe.metrica.hch0}</li>
            <li><b>PM:</b> ${informe.metrica.pm}</li>
            <li><b>Fuente:</b> ${informe.metrica.origen}</li>
          </ul>
        </div>

        <p style="font-size:13px;color:#666;margin-top:20px;">
          Cuídate y mantente informado sobre la calidad del aire.<br/>
          — <b>AirSnap</b>
        </p>
      </div>
    `;

    const text =
      `${informe.mensaje}\n` +
      `AQI: ${informe.metrica.aqi} | ` +
      `NO₂: ${informe.metrica.dioxidonitrogeno} | ` +
      `HCHO: ${informe.metrica.hch0} | ` +
      `PM: ${informe.metrica.pm} | ` +
      `Fuente: ${informe.metrica.origen}`;

    return { subject, html, text };
  }
}
