import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateNotificationDto {
  @PrimaryGeneratedColumn()
  id_notification: number;

  @IsNumber()
  @IsNotEmpty()
  userIdUser: number;

  @IsNumber()
  @IsOptional()
  isRead: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  tittle: string;

  @IsString()
  @IsNotEmpty()
  icon: string;

  @IsString()
  @IsOptional()
  photo: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsNumber()
  @IsOptional()
  status: number;
}
