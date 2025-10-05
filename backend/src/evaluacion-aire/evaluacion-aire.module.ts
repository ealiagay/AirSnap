import { Module } from '@nestjs/common';
import { EvaluacionAireService } from './evaluacion-aire.service';
import { EvaluacionAireController } from './evaluacion-aire.controller';

@Module({
  controllers: [EvaluacionAireController],
  providers: [EvaluacionAireService],
})
export class EvaluacionAireModule {}
