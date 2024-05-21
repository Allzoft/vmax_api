import { PartialType } from '@nestjs/swagger';
import { CreateRetreatDto } from './create-retreat.dto';

export class UpdateRetreatDto extends PartialType(CreateRetreatDto) {}
