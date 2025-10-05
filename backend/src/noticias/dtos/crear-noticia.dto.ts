import {
  IsOptional,
  IsString,
  Length,
  IsUUID,
  IsDateString,
} from "class-validator";

export class CrearNoticiaDto {
  @IsString()
  @Length(3, 250)
  titulo!: string;

  @IsString()
  contenido!: string;

  @IsOptional()
  @IsDateString()
  fechaPublicacion?: string;

  @IsOptional()
  @IsUUID()
  paginaId?: string;
}
