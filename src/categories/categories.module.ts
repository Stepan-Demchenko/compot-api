import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { CategoryImage } from './entities/category-image.entity';
import { IsCategoryNameUnique } from './dto/is-category-name-unique';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, IsCategoryNameUnique],
  imports: [TypeOrmModule.forFeature([Category, CategoryImage]), AuthModule, UsersModule],
})
export class CategoriesModule {}
