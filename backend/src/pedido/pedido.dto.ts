import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { StatusPedido } from './pedido.entity';

export class CreatePedidoDto {
  @IsUUID()
  motoboyId: string;

  @IsString()
  numeroNota: string;

  @IsString()
  cliente: string;

  @IsString()
  endereco: string;

  @IsNumber()
  valor: number;

  @IsNumber()
  taxaEntrega: number;

  @IsOptional()
  @IsString()
  observacao?: string;
}

export class UpdatePedidoDto {
  @IsOptional()
  @IsUUID()
  motoboyId?: string;

  @IsOptional()
  @IsString()
  numeroNota?: string;

  @IsOptional()
  @IsString()
  cliente?: string;

  @IsOptional()
  @IsString()
  endereco?: string;

  @IsOptional()
  @IsNumber()
  valor?: number;

  @IsOptional()
  @IsNumber()
  taxaEntrega?: number;

  @IsOptional()
  @IsEnum(StatusPedido)
  status?: StatusPedido;

  @IsOptional()
  @IsString()
  observacao?: string;
}
