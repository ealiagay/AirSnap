// src/app.module.ts
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import AppDataSource from './database/data-source'
import { UsersModule } from './users/users.module'
import { EmailModule } from './email/email.module'
import { NotificacionService } from './notificacion/notificacion.service'
import { NotificacionModule } from './notificacion/notificacion.module'
import { GeminiModule } from './gemini/gemini.module'
import { UsuariosModule } from "./usuarios/usuarios.module";
import { NoticiasModule } from "./noticias/noticias.module";
import { EvaluacionAireModule } from './evaluacion-aire/evaluacion-aire.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...AppDataSource.options,
        autoLoadEntities: true,
      }),
    }),
    UsersModule,
    EmailModule,
    NotificacionModule,
    GeminiModule,
    UsuariosModule,
    NoticiasModule,
    EvaluacionAireModule,
  ],
  providers: [NotificacionService],
})
export class AppModule {}