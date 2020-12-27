import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Food } from './entities/food.entity';
import { Category } from './entities/category.entity';
import { Ingredient } from './entities/ingridient.entity';
import { FoodsController } from './controlers/foods/foods.controller';
import { FoodsService } from './services/foods/foods.service';
import { CategoriesService } from './services/categories/categories.service';
import { IngredientsService } from './services/ingredients/ingredients.service';
import { CategoriesController } from './controlers/categories/categories.controller';
import { IngredientsController } from './controlers/ingredients/ingredients.controller';

@Module({
  controllers: [FoodsController, CategoriesController, IngredientsController],
  imports: [TypeOrmModule.forFeature([Food, Category, Ingredient])],
  providers: [FoodsService, CategoriesService, IngredientsService],
})
export class FoodsModule {}
