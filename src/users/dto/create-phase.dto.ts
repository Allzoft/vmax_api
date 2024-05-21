import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreatePhaseDto {
  @PrimaryGeneratedColumn()
  id_phase: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  task_number: number;

  @IsNumber()
  @IsOptional()
  status: number;
}
