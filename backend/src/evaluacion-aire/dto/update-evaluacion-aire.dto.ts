import { PartialType } from '@nestjs/mapped-types';
import { CreateEvaluacionAireDto } from './peticion-evaluacion-aire.dto';

export class UpdateEvaluacionAireDto extends PartialType(CreateEvaluacionAireDto) {}
