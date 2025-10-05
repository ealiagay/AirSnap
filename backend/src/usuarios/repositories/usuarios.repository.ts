import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
import { UsuarioEntity } from '../entities/usuario.entity';
import { CrearUsuarioDto } from '../dtos/crear-usuario.dto';
import { ActualizarUsuarioDto } from '../dtos/actualizar-usuario.dto';

@Injectable()
export class UsuariosRepository {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly repo: Repository<UsuarioEntity>,
  ) {}

  async listar(page = 1, limit = 20) {
    const take = Math.min(100, Math.max(1, limit));
    const skip = Math.max(0, (Math.max(1, page) - 1) * take);
    const [data, total] = await this.repo.findAndCount({
      order: { nombreCompleto: 'ASC' },
      skip,
      take,
    });
    return { data, total, page, limit: take };
  }

  async obtenerPorId(id: string): Promise<UsuarioEntity> {
    const u = await this.repo.findOne({ where: { id } });
    if (!u) throw new NotFoundException('Usuario no encontrado');
    return u;
  }

  private async correoExiste(correo: string, exceptId?: string) {
    const c = correo.toLowerCase();
    const existente = await this.repo.findOne({ where: { correoElectronico: c } });
    if (!existente) return false;
    if (exceptId && existente.id === exceptId) return false;
    return true;
  }

  async crear(dto: CrearUsuarioDto): Promise<UsuarioEntity> {
    const correo = dto.correoElectronico.toLowerCase();
    if (await this.correoExiste(correo)) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    const entidad = this.repo.create({
      correoElectronico: correo,
      nombreCompleto: dto.nombreCompleto,
      fechaNacimiento: dto.fechaNacimiento ? new Date(dto.fechaNacimiento) : null,
      enfermedad: dto.enfermedad ?? null,
      latitud: dto.latitud ?? null,
      longitud: dto.longitud ?? null,
    });
    return this.repo.save(entidad);
  }

  async actualizar(id: string, dto: ActualizarUsuarioDto): Promise<UsuarioEntity> {
    const u = await this.obtenerPorId(id);

    if (typeof dto.correoElectronico !== 'undefined') {
      const correo = dto.correoElectronico.toLowerCase();
      if (await this.correoExiste(correo, id)) {
        throw new ConflictException('El correo electrónico ya está registrado en otro usuario');
      }
      u.correoElectronico = correo;
    }
    if (typeof dto.nombreCompleto !== 'undefined') u.nombreCompleto = dto.nombreCompleto;
    if (typeof dto.fechaNacimiento !== 'undefined')
      u.fechaNacimiento = dto.fechaNacimiento ? new Date(dto.fechaNacimiento) : null;
    if (typeof dto.enfermedad !== 'undefined') u.enfermedad = dto.enfermedad ?? null;
    if (typeof dto.latitud !== 'undefined') u.latitud = dto.latitud ?? null;
    if (typeof dto.longitud !== 'undefined') u.longitud = dto.longitud ?? null;

    return this.repo.save(u);
  }

  async eliminar(id: string): Promise<void> {
    const res = await this.repo.delete({ id });
    if (!res.affected) throw new NotFoundException('Usuario no encontrado');
  }
}
