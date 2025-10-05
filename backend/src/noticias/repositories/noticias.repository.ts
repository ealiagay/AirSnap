import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NoticiaEntity } from "../entities/noticia.entity";
import { PaginaEntity } from "../entities/pagina.entity";
import { CrearNoticiaDto } from "../dtos/crear-noticia.dto";
import { ActualizarNoticiaDto } from "../dtos/actualizar-noticia.dto";
import { CrearPaginaDto } from "../dtos/crear-pagina.dto";
import { ActualizarPaginaDto } from "../dtos/actualizar-pagina.dto";

export interface INoticiasRepository {
  // Noticias
  listarNoticias(): Promise<NoticiaEntity[]>;
  crearNoticia(datos: CrearNoticiaDto): Promise<NoticiaEntity>;
  actualizarNoticia(
    idNoticia: string,
    cambios: ActualizarNoticiaDto
  ): Promise<NoticiaEntity>;

  // Páginas
  listarPaginas(): Promise<PaginaEntity[]>;
  crearPagina(datos: CrearPaginaDto): Promise<PaginaEntity>;
  actualizarPagina(
    idPagina: string,
    cambios: ActualizarPaginaDto
  ): Promise<PaginaEntity>;
}

@Injectable()
export class NoticiasRepository implements INoticiasRepository {
  constructor(
    @InjectRepository(NoticiaEntity)
    private readonly ormRepositorioNoticias: Repository<NoticiaEntity>,
    @InjectRepository(PaginaEntity)
    private readonly ormRepositorioPaginas: Repository<PaginaEntity>
  ) {}

  // Noticias
  async listarNoticias(): Promise<NoticiaEntity[]> {
    return this.ormRepositorioNoticias.find({
      relations: { pagina: true },
      order: { fechaCreacion: "DESC" },
    });
  }

  async crearNoticia(datos: CrearNoticiaDto): Promise<NoticiaEntity> {
    let pagina: PaginaEntity | null = null;
    if (datos.paginaId) {
      pagina = await this.ormRepositorioPaginas.findOne({
        where: { id: datos.paginaId },
      });
      if (!pagina) throw new NotFoundException("Página asociada no encontrada");
    }

    const entidad = this.ormRepositorioNoticias.create({
      titulo: datos.titulo,
      contenido: datos.contenido,
      fechaPublicacion: datos.fechaPublicacion
        ? new Date(datos.fechaPublicacion)
        : null,
      pagina: pagina ?? null,
    });
    return this.ormRepositorioNoticias.save(entidad);
  }

  async actualizarNoticia(
    idNoticia: string,
    cambios: ActualizarNoticiaDto
  ): Promise<NoticiaEntity> {
    const existente = await this.ormRepositorioNoticias.findOne({
      where: { id: idNoticia },
      relations: { pagina: true },
    });
    if (!existente) throw new NotFoundException("Noticia no encontrada");

    if (typeof cambios.titulo !== "undefined")
      existente.titulo = cambios.titulo;
    if (typeof cambios.contenido !== "undefined")
      existente.contenido = cambios.contenido;
    if (typeof cambios.fechaPublicacion !== "undefined") {
      existente.fechaPublicacion = cambios.fechaPublicacion
        ? new Date(cambios.fechaPublicacion)
        : null;
    }
    if (typeof cambios.paginaId !== "undefined") {
      if (cambios.paginaId === null) {
        existente.pagina = null;
      } else {
        const pagina = await this.ormRepositorioPaginas.findOne({
          where: { id: cambios.paginaId },
        });
        if (!pagina)
          throw new NotFoundException("Página asociada no encontrada");
        existente.pagina = pagina;
      }
    }

    return this.ormRepositorioNoticias.save(existente);
  }

  // Páginas
  async listarPaginas(): Promise<PaginaEntity[]> {
    return this.ormRepositorioPaginas.find({
      order: { fechaCreacion: "DESC" },
    });
  }

  async crearPagina(datos: CrearPaginaDto): Promise<PaginaEntity> {
    const entidad = this.ormRepositorioPaginas.create({
      titulo: datos.titulo,
      slug: datos.slug,
      contenido: datos.contenido,
      estado: datos.estado ?? "borrador",
    });
    return this.ormRepositorioPaginas.save(entidad);
  }

  async actualizarPagina(
    idPagina: string,
    cambios: ActualizarPaginaDto
  ): Promise<PaginaEntity> {
    const existente = await this.ormRepositorioPaginas.findOne({
      where: { id: idPagina },
    });
    if (!existente) throw new NotFoundException("Página no encontrada");

    if (typeof cambios.titulo !== "undefined")
      existente.titulo = cambios.titulo;
    if (typeof cambios.slug !== "undefined") existente.slug = cambios.slug;
    if (typeof cambios.contenido !== "undefined")
      existente.contenido = cambios.contenido;
    if (typeof cambios.estado !== "undefined")
      existente.estado = cambios.estado;

    return this.ormRepositorioPaginas.save(existente);
  }
}
