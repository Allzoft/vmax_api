import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateOrderTemplateDto {
  @PrimaryGeneratedColumn()
  id_order_template: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  phaseIdPhase: number;

  @IsString()
  @IsNotEmpty()
  photo: string;

  @IsNumber()
  @IsNotEmpty()
  price_per_unit: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  total_price: number;

  @IsNumber()
  @IsNotEmpty()
  commission: number;

  @IsNumber()
  @IsOptional()
  status: number;
}
