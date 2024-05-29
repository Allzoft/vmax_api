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

  @IsNumber()
  @IsOptional()
  vip_1_earning: number;

  @IsNumber()
  @IsOptional()
  vip_2_earning: number;

  @IsNumber()
  @IsOptional()
  vip_3_earning: number;
}
