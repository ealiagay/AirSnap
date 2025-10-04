import { IsOptional, IsString, Length, Matches } from "class-validator";

export class CrearPaginaDto {
  @IsString()
  @Length(3, 200)
  titulo!: string;

  @IsString()
  @Length(3, 200)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: "El slug debe estar en minúsculas y usar guiones medios.",
  })
  slug!: string;

  @IsOptional()
  @IsString()
  contenido?: string;

  @IsOptional()
  @IsString()
  estado?: string;
}
