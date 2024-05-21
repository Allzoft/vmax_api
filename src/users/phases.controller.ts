import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PhasesService } from './services/phases.service';

import { CreatePhaseDto } from './dto/create-phase.dto';
import { UpdatePhaseDto } from './dto/update-phase.dto';

import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('orders')
@Controller('phases')
export class PhasesController {
  constructor(private readonly phasesService: PhasesService) {}

  @Post()
  create(@Body() createPhaseDto: CreatePhaseDto) {
    return this.phasesService.create(createPhaseDto);
  }

  @Get()
  findAll() {
    return this.phasesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.phasesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePhaseDto: UpdatePhaseDto) {
    return this.phasesService.update(+id, updatePhaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.phasesService.remove(+id);
  }
}
