import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsuarioEntity } from "./entities/usuario.entity";
import { UsuariosController } from "./controllers/usuarios.controller";
import { UsuariosService } from "./services/usuarios.service";
import { USUARIOS_REPOSITORIO } from "./constantes/usuarios.constantes";
import { UsuariosRepository } from "./repositories/usuarios.repository";

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity])],
  controllers: [UsuariosController],
  providers: [
    UsuariosService,
    { provide: USUARIOS_REPOSITORIO, useClass: UsuariosRepository },
  ],
  exports: [UsuariosService],
})
export class UsuariosModule {}
