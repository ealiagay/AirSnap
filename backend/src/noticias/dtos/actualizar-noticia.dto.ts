import {
  IsOptional,
  IsString,
  Length,
  IsUUID,
  IsDateString,
} from "class-validator";

export class ActualizarNoticiaDto {
  @IsOptional()
  @IsString()
  @Length(3, 250)
  titulo?: string;

  @IsOptional()
  @IsString()
  contenido?: string;

  @IsOptional()
  @IsDateString()
  fechaPublicacion?: string;

  @IsOptional()
  @IsUUID()
  paginaId?: string;
}
