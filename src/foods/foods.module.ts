import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Food } from './entities/food.entity';
import { FoodsService } from './foods.service';
import { Event } from './entities/event.entity';
import { FoodsController } from './foods.controller';

@Module({
  controllers: [FoodsController],
  imports: [TypeOrmModule.forFeature([Food, Event])],
  providers: [FoodsService],
})
export class FoodsModule {}
