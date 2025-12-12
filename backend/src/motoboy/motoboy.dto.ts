import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { StatusMotoboy } from './motoboy.entity';

export class CreateMotoboyDto {
  @IsString()
  nome: string;

  @IsString()
  telefone: string;

  @IsString()
  placa: string;

  @IsOptional()
  @IsEnum(StatusMotoboy)
  status?: StatusMotoboy;
}

export class UpdateMotoboyDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsString()
  placa?: string;

  @IsOptional()
  @IsEnum(StatusMotoboy)
  status?: StatusMotoboy;

  @IsOptional()
  totalEntregas?: number;

  @IsOptional()
  @IsNumber()
  totalValor?: number;
}
