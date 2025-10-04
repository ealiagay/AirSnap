import { Inject, Injectable } from "@nestjs/common";
import { USUARIOS_REPOSITORIO } from "../constantes/usuarios.constantes";
import { IUsuariosRepository } from "../repositories/usuarios.repository";
import { CrearUsuarioDto } from "../dtos/crear-usuario.dto";
import { ActualizarUsuarioDto } from "../dtos/actualizar-usuario.dto";
import { UsuarioEntity } from "../entities/usuario.entity";

@Injectable()
export class UsuariosService {
  constructor(
    @Inject(USUARIOS_REPOSITORIO)
    private readonly repositorioUsuarios: IUsuariosRepository
  ) {}

  listar(): Promise<UsuarioEntity[]> {
    return this.repositorioUsuarios.listarUsuarios();
  }

  crear(payload: CrearUsuarioDto): Promise<UsuarioEntity> {
    return this.repositorioUsuarios.crearUsuario(payload);
  }

  actualizar(
    idUsuario: string,
    cambios: ActualizarUsuarioDto
  ): Promise<UsuarioEntity> {
    return this.repositorioUsuarios.actualizarUsuario(idUsuario, cambios);
  }
}
