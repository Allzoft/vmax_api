import { PrimaryGeneratedColumn } from 'typeorm';
import { TypeCredit } from '../entities/credit.entity';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCreditDto {
  @PrimaryGeneratedColumn()
  id_credit: number;

  @IsEnum(TypeCredit)
  @IsNotEmpty()
  type_credit: TypeCredit;

  @IsNumber()
  @IsOptional()
  previous_amount: number;

  @IsNumber()
  @IsNotEmpty()
  stateIdState: number;

  @IsNumber()
  @IsNotEmpty()
  walletIdWallet: number;

  @IsNumber()
  @IsNotEmpty()
  credit_amount: number;

  @IsNumber()
  @IsOptional()
  subsequent_amount: number;

  @IsDate()
  @Transform(({ value }) => value && new Date(value))
  credit_date: Date;

  @IsNumber()
  @IsOptional()
  status: number;
}
