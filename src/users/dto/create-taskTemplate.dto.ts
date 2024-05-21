import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';
import { TypeTask } from '../entities/taskTemplate.entity';

export class CreateTaskTemplateDto {
  @PrimaryGeneratedColumn()
  id_task_template: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(TypeTask)
  @IsNotEmpty()
  type_task: TypeTask;

  @IsString()
  task_link: string;

  @IsNumber()
  @IsNotEmpty()
  phaseIdPhase: number;

  @IsNumber()
  @IsOptional()
  status: number;
}
