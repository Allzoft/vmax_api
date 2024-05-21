import { PartialType } from '@nestjs/swagger';
import { CreateTaskTemplateDto } from './create-taskTemplate.dto';

export class UpdateTaskTemplateDto extends PartialType(CreateTaskTemplateDto) {}
