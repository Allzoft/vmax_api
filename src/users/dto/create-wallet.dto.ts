import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateWalletDto {
  @PrimaryGeneratedColumn()
  id_wallet: number;

  @IsNumber()
  @IsNotEmpty()
  balance: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsNumber()
  @IsOptional()
  status: number;
}
