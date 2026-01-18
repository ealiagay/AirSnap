import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { EvaluacionAireController } from './evaluacion-aire.controller';
import { EvaluacionAireService } from './evaluacion-aire.service';
import { GeminiService } from '../gemini/gemini.service'; // ✅ Importa tu servicio

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule.register({
      baseURL: process.env.AIR_EXTERNAL_BASE_URL ?? 'https://mi-endpoint-externo-ficticio.tld',
      timeout: 10000,
    }),
  ],
  controllers: [EvaluacionAireController],
  providers: [EvaluacionAireService, GeminiService],
})
export class EvaluacionAireModule {}
