import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreatePhaseDto {
  @PrimaryGeneratedColumn()
  id_phase: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  status: number;
}
