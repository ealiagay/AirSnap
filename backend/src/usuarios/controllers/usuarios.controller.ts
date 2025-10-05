import { Body, Controller, Get, Post, Put, Param } from "@nestjs/common";
import { UsuariosService } from "../services/usuarios.service";
import { CrearUsuarioDto } from "../dtos/crear-usuario.dto";
import { ActualizarUsuarioDto } from "../dtos/actualizar-usuario.dto";
import { UsuarioEntity } from "../entities/usuario.entity";

@Controller("usuarios")
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // GET /usuarios
  @Get()
  listarUsuarios(): Promise<UsuarioEntity[]> {
    return this.usuariosService.listar();
  }

  // POST /usuarios
  @Post()
  crearUsuario(@Body() datos: CrearUsuarioDto): Promise<UsuarioEntity> {
    return this.usuariosService.crear(datos);
  }

  // PUT /usuarios/:id
  @Put(":id")
  actualizarUsuario(
    @Param("id") idUsuario: string,
    @Body() cambios: ActualizarUsuarioDto
  ): Promise<UsuarioEntity> {
    return this.usuariosService.actualizar(idUsuario, cambios);
  }
}
