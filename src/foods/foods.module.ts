import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Food } from './entities/food.entity';
import { Event } from './entities/event.entity';
import { Category } from './entities/category.entity';
import { Ingredient } from './entities/ingridient.entity';
import { FoodsService } from './services/foods/foods.service';
import { FoodsController } from './controlers/foods/foods.controller';
import { CategoriesService } from './services/categories/categories.service';
import { IngredientsService } from './services/ingredients/ingredients.service';
import { CategoriesController } from './controlers/categories/categories.controller';
import { IngredientsController } from './controlers/ingredients/ingredients.controller';

@Module({
  controllers: [FoodsController, CategoriesController, IngredientsController],
  imports: [TypeOrmModule.forFeature([Food, Category, Ingredient, Event])],
  providers: [FoodsService, CategoriesService, IngredientsService],
})
export class FoodsModule {}
