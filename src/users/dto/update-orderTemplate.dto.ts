import { PartialType } from '@nestjs/swagger';
import { CreateOrderTemplateDto } from './create-orderTemplate.dto';

export class UpdateOrderTemplateDto extends PartialType(
  CreateOrderTemplateDto,
) {}
