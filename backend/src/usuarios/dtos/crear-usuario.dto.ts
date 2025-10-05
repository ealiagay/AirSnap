import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CrearUsuarioDto {
  @IsEmail({}, { message: 'Correo inválido' })
  correoElectronico!: string;

  @IsString()
  @Length(2, 255)
  nombreCompleto!: string;

  @IsOptional()
  @IsDateString({}, { message: 'fechaNacimiento debe ser YYYY-MM-DD' })
  fechaNacimiento?: string; // vendrá en string ISO (YYYY-MM-DD)

  @IsOptional()
  @IsString()
  @Length(0, 120)
  enfermedad?: string;

  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === null || value === undefined ? undefined : Number(value),
  )
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(-90)
  @Max(90)
  latitud?: number;

  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === null || value === undefined ? undefined : Number(value),
  )
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Min(-180)
  @Max(180)
  longitud?: number;
}
