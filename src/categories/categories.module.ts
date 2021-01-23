import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryImage } from './entities/category-image.entity';
import { IsCategoryNameUnique } from './dto/is-category-name-unique';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, IsCategoryNameUnique],
  imports: [TypeOrmModule.forFeature([Category, CategoryImage])],
})
export class CategoriesModule {}
