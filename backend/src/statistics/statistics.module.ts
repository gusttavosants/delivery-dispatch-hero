import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { PedidoModule } from '../pedido/pedido.module';
import { MotoboyModule } from '../motoboy/motoboy.module';

@Module({
  imports: [PedidoModule, MotoboyModule],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
