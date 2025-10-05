import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsuarioEntity } from "../entities/usuario.entity";
import { CrearUsuarioDto } from "../dtos/crear-usuario.dto";
import { ActualizarUsuarioDto } from "../dtos/actualizar-usuario.dto";

export interface IUsuariosRepository {
  listarUsuarios(): Promise<UsuarioEntity[]>;
  crearUsuario(datos: CrearUsuarioDto): Promise<UsuarioEntity>;
  actualizarUsuario(
    idUsuario: string,
    cambios: ActualizarUsuarioDto
  ): Promise<UsuarioEntity>;
}

@Injectable()
export class UsuariosRepository implements IUsuariosRepository {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly ormRepositorioUsuarios: Repository<UsuarioEntity>
  ) {}

  async listarUsuarios(): Promise<UsuarioEntity[]> {
    return this.ormRepositorioUsuarios.find({
      order: { fechaCreacion: "DESC" },
    });
  }

  async crearUsuario(datos: CrearUsuarioDto): Promise<UsuarioEntity> {
    const entidad = this.ormRepositorioUsuarios.create({
      correoElectronico: datos.correoElectronico,
      nombreCompleto: datos.nombreCompleto,
    });
    return this.ormRepositorioUsuarios.save(entidad);
  }

  async actualizarUsuario(
    idUsuario: string,
    cambios: ActualizarUsuarioDto
  ): Promise<UsuarioEntity> {
    const existente = await this.ormRepositorioUsuarios.findOne({
      where: { id: idUsuario },
    });
    if (!existente) throw new NotFoundException("Usuario no encontrado");

    if (typeof cambios.correoElectronico !== "undefined") {
      existente.correoElectronico = cambios.correoElectronico;
    }
    if (typeof cambios.nombreCompleto !== "undefined") {
      existente.nombreCompleto = cambios.nombreCompleto;
    }
    return this.ormRepositorioUsuarios.save(existente);
  }
}
