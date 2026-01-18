// src/notificacion/notificacion.module.ts
import { Module } from '@nestjs/common';
import { NotificacionService } from './notificacion.service';
import { NotificacionController } from './notificacion.controller';
import { GeminiModule } from '../gemini/gemini.module'; // 👈 Agregar
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    GeminiModule,  // 👈 Agregar esta línea
    EmailModule,
  ],
  controllers: [NotificacionController],
  providers: [NotificacionService],
  exports: [NotificacionService],
})
export class NotificacionModule {}