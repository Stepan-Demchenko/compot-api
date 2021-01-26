import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IngredientsService } from './ingredients.service';
import { IngredientsController } from './ingredients.controller';
import { Ingredient } from './entities/ingredient.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [IngredientsController],
  providers: [IngredientsService],
  imports: [TypeOrmModule.forFeature([Ingredient]), AuthModule, UsersModule],
})
export class IngredientsModule {}
