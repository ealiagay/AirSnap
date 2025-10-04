import { IsEmail, IsOptional, IsString, Length } from "class-validator";

export class ActualizarUsuarioDto {
  @IsOptional()
  @IsEmail(
    {},
    { message: "El correo electrónico debe tener un formato válido." }
  )
  correoElectronico?: string;

  @IsOptional()
  @IsString()
  @Length(2, 255, {
    message: "El nombre completo debe tener entre 2 y 255 caracteres.",
  })
  nombreCompleto?: string;
}
