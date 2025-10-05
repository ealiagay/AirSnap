// src/users/usuarios.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';                    // 👈 AÑADIR
import { UsuarioEntity } from './entities/usuario.entity';
import { UsuariosController } from './controllers/usuarios.controller';
import { UsuariosService } from './services/usuarios.service';
import { UsuariosRepository } from './repositories/usuarios.repository';
import { EvaluacionAireService } from '../evaluacion-aire/evaluacion-aire.service';
import { GeminiService } from '../gemini/gemini.service';      // 👈 AÑADIR
import { GeminiModule } from '@/gemini/gemini.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsuarioEntity]),
    ScheduleModule.forRoot(),
    HttpModule,
    GeminiModule,
  ],
  controllers: [UsuariosController],
  providers: [
    UsuariosService,
    UsuariosRepository,
    EvaluacionAireService,
    GeminiService,                                             // 👈 AÑADIR
  ],
  exports: [UsuariosService, UsuariosRepository],
})
export class UsuariosModule {}
