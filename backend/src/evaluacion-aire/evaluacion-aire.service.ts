import { Injectable } from '@nestjs/common';
import { CreateEvaluacionAireDto } from './dto/peticion-evaluacion-aire.dto';
import { UpdateEvaluacionAireDto } from './dto/update-evaluacion-aire.dto';

@Injectable()
export class EvaluacionAireService {
  create(createEvaluacionAireDto: CreateEvaluacionAireDto) {
    return 'This action adds a new evaluacionAire';
  }

  findAll() {
    return `This action returns all evaluacionAire`;
  }

  findOne(id: number) {
    return `This action returns a #${id} evaluacionAire`;
  }

  update(id: number, updateEvaluacionAireDto: UpdateEvaluacionAireDto) {
    return `This action updates a #${id} evaluacionAire`;
  }

  remove(id: number) {
    return `This action removes a #${id} evaluacionAire`;
  }
}
