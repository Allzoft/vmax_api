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
import { OrderTemplatesService } from './services/orderTemplates.service';

import { CreateOrderTemplateDto } from './dto/create-orderTemplate.dto';
import { UpdateOrderTemplateDto } from './dto/update-orderTemplate.dto';

import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('users')
@Controller('orderTemplates')
export class OrderTemplatesController {
  constructor(private readonly orderTemplatesService: OrderTemplatesService) {}

  @Post()
  create(@Body() createOrderTemplateDto: CreateOrderTemplateDto) {
    return this.orderTemplatesService.create(createOrderTemplateDto);
  }

  @Get()
  findAll() {
    return this.orderTemplatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderTemplatesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderTemplateDto: UpdateOrderTemplateDto,
  ) {
    return this.orderTemplatesService.update(+id, updateOrderTemplateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderTemplatesService.remove(+id);
  }
}
