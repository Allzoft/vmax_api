import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateRetreatDto {
  @PrimaryGeneratedColumn()
  id_retreat: number;

  @IsString()
  @IsOptional()
  account_name: string;

  @IsString()
  @IsOptional()
  account_code: string;

  @IsString()
  @IsOptional()
  bank_name: string;

  @IsNumber()
  @IsNotEmpty()
  total_retreat: number;

  @IsNumber()
  @IsNotEmpty()
  stateIdState: number;

  @IsNumber()
  @IsNotEmpty()
  userIdUser: number;

  @IsNumber()
  @IsOptional()
  status: number;
}
