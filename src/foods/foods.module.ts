import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Food } from './entities/food.entity';
import { Category } from './entities/category.entity';
import { Ingredient } from './entities/ingridient.entity';
import { BaseEntity } from './entities/base.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BaseEntity, Food, Category, Ingredient])],
})
export class FoodsModule {}
