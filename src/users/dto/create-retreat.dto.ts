import { Transform } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
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

  @IsDate()
  @Transform(({ value }) => value && new Date(value))
  retreat_date: Date;

  @IsNumber()
  @IsNotEmpty()
  stateIdState: number;

  @IsNumber()
  @IsNotEmpty()
  walletIdWallet: number;

  @IsNumber()
  @IsOptional()
  status: number;
}
