import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EvaluacionAireService } from './evaluacion-aire.service';
import { PeticionEvaluacionAireDto } from './dto/peticion-evaluacion-aire.dto';

@Controller('evaluacion-aire')
export class EvaluacionAireController {
  constructor(private readonly evaluacionAireService: EvaluacionAireService) {}

  @Post()
  create(@Body() peticionEvaluacionAireDto: PeticionEvaluacionAireDto) {
    return this.evaluacionAireService.create(peticionEvaluacionAireDto);
  }

  /*
  @Get()
  findAll() {
    return this.evaluacionAireService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.evaluacionAireService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEvaluacionAireDto: UpdateEvaluacionAireDto) {
    return this.evaluacionAireService.update(+id, updateEvaluacionAireDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.evaluacionAireService.remove(+id);
  }
    */
}
