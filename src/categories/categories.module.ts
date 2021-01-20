import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [TypeOrmModule.forFeature([Category]), AuthModule, UsersModule],
})
export class CategoriesModule {}
