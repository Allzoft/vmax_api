import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';
import { TypeState } from '../entities/state.entity';

export class CreateStateDto {
  @PrimaryGeneratedColumn()
  id_state: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(TypeState)
  @IsNotEmpty()
  type: TypeState;

  @IsNumber()
  @IsNotEmpty()
  priority: number;

  @IsNumber()
  @IsOptional()
  status: number;
}
