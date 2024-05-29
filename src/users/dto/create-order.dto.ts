import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateOrderDto {
  @PrimaryGeneratedColumn()
  id_order: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  stateIdState: number;

  @IsNumber()
  @IsNotEmpty()
  userIdUser: number;

  @IsString()
  @IsOptional()
  photo: string;

  @IsNumber()
  @IsNotEmpty()
  price_per_unit: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsOptional()
  category: number;

  @IsNumber()
  @IsNotEmpty()
  total_price: number;

  @IsNumber()
  @IsNotEmpty()
  commission: number;

  @IsDate()
  @Transform(({ value }) => value && new Date(value))
  order_date: Date;

  @IsString()
  @IsOptional()
  uuid: string;

  @IsNumber()
  @IsOptional()
  status: number;
}
