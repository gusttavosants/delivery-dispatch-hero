import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Motoboy } from './motoboy/motoboy.entity';
import { Pedido } from './pedido/pedido.entity';
import { MotoboyModule } from './motoboy/motoboy.module';
import { PedidoModule } from './pedido/pedido.module';
import { StatisticsModule } from './statistics/statistics.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'database.sqlite',
      entities: [Motoboy, Pedido],
      synchronize: true,
    }),
    MotoboyModule,
    PedidoModule,
    StatisticsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
