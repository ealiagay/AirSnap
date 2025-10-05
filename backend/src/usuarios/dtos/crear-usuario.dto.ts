import { IsEmail, IsString, Length } from "class-validator";

export class CrearUsuarioDto {
  @IsEmail(
    {},
    { message: "El correo electrónico debe tener un formato válido." }
  )
  correoElectronico!: string;

  @IsString()
  @Length(2, 255, {
    message: "El nombre completo debe tener entre 2 y 255 caracteres.",
  })
  nombreCompleto!: string;
}
