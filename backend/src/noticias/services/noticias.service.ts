import { Inject, Injectable } from "@nestjs/common";
import { NOTICIAS_REPOSITORIO } from "../constantes/noticias.constantes";
import { INoticiasRepository } from "../repositories/noticias.repository";
import { CrearNoticiaDto } from "../dtos/crear-noticia.dto";
import { ActualizarNoticiaDto } from "../dtos/actualizar-noticia.dto";
import { CrearPaginaDto } from "../dtos/crear-pagina.dto";
import { ActualizarPaginaDto } from "../dtos/actualizar-pagina.dto";
import { NoticiaEntity } from "../entities/noticia.entity";
import { PaginaEntity } from "../entities/pagina.entity";

@Injectable()
export class NoticiasService {
  constructor(
    @Inject(NOTICIAS_REPOSITORIO)
    private readonly repositorioNoticias: INoticiasRepository
  ) {}

  // Noticias
  listarNoticias(): Promise<NoticiaEntity[]> {
    return this.repositorioNoticias.listarNoticias();
  }

  crearNoticia(payload: CrearNoticiaDto): Promise<NoticiaEntity> {
    return this.repositorioNoticias.crearNoticia(payload);
  }

  actualizarNoticia(
    idNoticia: string,
    cambios: ActualizarNoticiaDto
  ): Promise<NoticiaEntity> {
    return this.repositorioNoticias.actualizarNoticia(idNoticia, cambios);
  }

  // Páginas
  listarPaginas(): Promise<PaginaEntity[]> {
    return this.repositorioNoticias.listarPaginas();
  }

  crearPagina(payload: CrearPaginaDto): Promise<PaginaEntity> {
    return this.repositorioNoticias.crearPagina(payload);
  }

  actualizarPagina(
    idPagina: string,
    cambios: ActualizarPaginaDto
  ): Promise<PaginaEntity> {
    return this.repositorioNoticias.actualizarPagina(idPagina, cambios);
  }
}
