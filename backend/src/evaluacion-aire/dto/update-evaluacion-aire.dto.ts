import { PartialType } from '@nestjs/mapped-types';
import { PeticionEvaluacionAireDto } from './peticion-evaluacion-aire.dto';

export class UpdateEvaluacionAireDto extends PartialType(PeticionEvaluacionAireDto) {}
