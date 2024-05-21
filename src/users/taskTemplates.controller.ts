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
import { TaskTemplatesService } from './services/taskTemplates.service';

import { CreateTaskTemplateDto } from './dto/create-taskTemplate.dto';
import { UpdateTaskTemplateDto } from './dto/update-taskTemplate.dto';

import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('users')
@Controller('taskTemplates')
export class TaskTemplatesController {
  constructor(private readonly taskTemplatesService: TaskTemplatesService) {}

  @Post()
  create(@Body() createTaskTemplateDto: CreateTaskTemplateDto) {
    return this.taskTemplatesService.create(createTaskTemplateDto);
  }

  @Get()
  findAll() {
    return this.taskTemplatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskTemplatesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskTemplateDto: UpdateTaskTemplateDto,
  ) {
    return this.taskTemplatesService.update(+id, updateTaskTemplateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskTemplatesService.remove(+id);
  }
}
