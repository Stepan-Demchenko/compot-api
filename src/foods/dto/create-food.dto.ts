import { IsArray, IsNumber, IsString } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Type } from 'class-transformer';
import { Ingredient } from '../../ingredients/entities/ingredient.entity';

export class CreateFoodDto {
  @IsString()
  readonly title: string;

  @Type(() => Number)
  @IsNumber({ allowInfinity: true, maxDecimalPlaces: 2 })
  price: number;

  @Type(() => Number)
  @IsNumber({ allowInfinity: true, maxDecimalPlaces: 2 })
  weight: number;

  @IsString()
  description: string;

  @IsArray()
  ingredients: Ingredient[];

  // @IsNumber({ allowNaN: false, allowInfinity: false })
  // category: Category;

  createBy: User;
}
