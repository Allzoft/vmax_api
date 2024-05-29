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
import { RetreatsService } from './services/retreats.service';

import { CreateRetreatDto } from './dto/create-retreat.dto';
import { UpdateRetreatDto } from './dto/update-retreat.dto';

import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiTags('users')
@Controller('retreats')
export class RetreatsController {
  constructor(private readonly retreatsService: RetreatsService) {}

  @Post()
  create(@Body() createRetreatDto: CreateRetreatDto) {
    return this.retreatsService.create(createRetreatDto);
  }

  @Get()
  findAll() {
    return this.retreatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.retreatsService.findOne(+id);
  }

  @Get('byWallet/:id/:limit/:offset')
  findByUser(
    @Param('id') id: string,
    @Param('limit') limit: string,
    @Param('offset') offset: string,
  ) {
    return this.retreatsService.findByWallet(+id, +limit, +offset);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRetreatDto: UpdateRetreatDto) {
    return this.retreatsService.update(+id, updateRetreatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.retreatsService.remove(+id);
  }
}
