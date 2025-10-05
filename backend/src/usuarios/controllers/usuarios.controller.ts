import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsuariosService } from '../services/usuarios.service';
import { CrearUsuarioDto } from '../dtos/crear-usuario.dto';
import { ActualizarUsuarioDto } from '../dtos/actualizar-usuario.dto';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly service: UsuariosService) {}

  // Crear
  @Post()
  crear(@Body() dto: CrearUsuarioDto) {
    return this.service.crear(dto);
  }

  // Listar (paginado opcional)
  @Get()
  listar(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.listar({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  // Obtener por id
  @Get(':id')
  obtener(@Param('id') id: string) {
    return this.service.obtenerPorId(id);
  }

  // Editar (parcial)
  @Patch(':id')
  actualizar(@Param('id') id: string, @Body() dto: ActualizarUsuarioDto) {
    return this.service.actualizar(id, dto);
  }

  // Eliminar
  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.service.eliminar(id);
  }
}
