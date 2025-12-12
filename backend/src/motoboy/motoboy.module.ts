import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MotoboyController } from './motoboy.controller';
import { MotoboyService } from './motoboy.service';
import { Motoboy } from './motoboy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Motoboy])],
  controllers: [MotoboyController],
  providers: [MotoboyService],
  exports: [MotoboyService],
})
export class MotoboyModule {}
