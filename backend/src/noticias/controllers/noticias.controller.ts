import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { NoticiasService } from "../services/noticias.service";
import { CrearNoticiaDto } from "../dtos/crear-noticia.dto";
import { ActualizarNoticiaDto } from "../dtos/actualizar-noticia.dto";
import { CrearPaginaDto } from "../dtos/crear-pagina.dto";
import { ActualizarPaginaDto } from "../dtos/actualizar-pagina.dto";
import { NoticiaEntity } from "../entities/noticia.entity";
import { PaginaEntity } from "../entities/pagina.entity";

@Controller()
export class NoticiasController {
  constructor(private readonly noticiasService: NoticiasService) {}

  // Rutas de noticias
  @Get("noticias")
  listarNoticias(): Promise<NoticiaEntity[]> {
    return this.noticiasService.listarNoticias();
  }

  @Post("noticias")
  crearNoticia(@Body() datos: CrearNoticiaDto): Promise<NoticiaEntity> {
    return this.noticiasService.crearNoticia(datos);
  }

  @Put("noticias/:id")
  actualizarNoticia(
    @Param("id") idNoticia: string,
    @Body() cambios: ActualizarNoticiaDto
  ): Promise<NoticiaEntity> {
    return this.noticiasService.actualizarNoticia(idNoticia, cambios);
  }

  // Rutas de páginas
  @Get("paginas")
  listarPaginas(): Promise<PaginaEntity[]> {
    return this.noticiasService.listarPaginas();
  }

  @Post("paginas")
  crearPagina(@Body() datos: CrearPaginaDto): Promise<PaginaEntity> {
    return this.noticiasService.crearPagina(datos);
  }

  @Put("paginas/:id")
  actualizarPagina(
    @Param("id") idPagina: string,
    @Body() cambios: ActualizarPaginaDto
  ): Promise<PaginaEntity> {
    return this.noticiasService.actualizarPagina(idPagina, cambios);
  }
}
