import { IsArray, IsNumber, IsString } from 'class-validator';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';
import { Type } from 'class-transformer';

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

  @Type(() => Number)
  @IsArray()
  @IsNumber({}, { each: true })
  ingredients: any[];

  // @IsNumber({ allowNaN: false, allowInfinity: false })
  // category: Category;

  createBy: User;
}
