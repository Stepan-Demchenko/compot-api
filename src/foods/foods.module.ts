import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { Food } from './entities/food.entity';
import { FoodsService } from './foods.service';
import { Event } from './entities/event.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { FoodsController } from './foods.controller';
import { CommonModule } from '../common/common.module';

@Module({
  controllers: [FoodsController],
  imports: [TypeOrmModule.forFeature([Food, Event]), AuthModule, UsersModule, CommonModule],
  providers: [FoodsService],
})
export class FoodsModule {}
