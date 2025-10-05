import { Injectable } from '@nestjs/common';
import { UsuariosRepository } from '../repositories/usuarios.repository';
import { CrearUsuarioDto } from '../dtos/crear-usuario.dto';
import { ActualizarUsuarioDto } from '../dtos/actualizar-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(private readonly repo: UsuariosRepository) {}

  listar(params?: { page?: number; limit?: number }) {
    return this.repo.listar(params?.page, params?.limit);
  }

  obtenerPorId(id: string) {
    return this.repo.obtenerPorId(id);
  }

  crear(dto: CrearUsuarioDto) {
    return this.repo.crear(dto);
  }

  actualizar(id: string, dto: ActualizarUsuarioDto) {
    return this.repo.actualizar(id, dto);
  }

  eliminar(id: string) {
    return this.repo.eliminar(id);
  }
}
