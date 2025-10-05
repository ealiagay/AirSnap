import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NoticiasController } from "./controllers/noticias.controller";
import { NoticiasService } from "./services/noticias.service";
import { NoticiasRepository } from "./repositories/noticias.repository";
import { NOTICIAS_REPOSITORIO } from "./constantes/noticias.constantes";
import { NoticiaEntity } from "./entities/noticia.entity";
import { PaginaEntity } from "./entities/pagina.entity";

@Module({
  imports: [TypeOrmModule.forFeature([NoticiaEntity, PaginaEntity])],
  controllers: [NoticiasController],
  providers: [
    NoticiasService,
    { provide: NOTICIAS_REPOSITORIO, useClass: NoticiasRepository },
  ],
  exports: [NoticiasService],
})
export class NoticiasModule {}
