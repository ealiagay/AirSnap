import { Body, Controller, Post } from '@nestjs/common';
import { EvaluacionAireService } from './evaluacion-aire.service';
import { PeticionEvaluacionAireDto } from './dto/peticion-evaluacion-aire.dto';

@Controller('evaluacion-aire')
export class EvaluacionAireController {
  constructor(private readonly service: EvaluacionAireService) {}

  @Post()
  async evaluar(@Body() dto: PeticionEvaluacionAireDto) {
    return this.service.evaluarCalidadAire(dto);
  }

}
