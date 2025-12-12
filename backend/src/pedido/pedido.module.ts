import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidoController } from './pedido.controller';
import { PedidoService } from './pedido.service';
import { Pedido } from './pedido.entity';
import { MotoboyModule } from '../motoboy/motoboy.module';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido]), MotoboyModule],
  controllers: [PedidoController],
  providers: [PedidoService],
  exports: [PedidoService],
})
export class PedidoModule {}
