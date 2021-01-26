import { IsNumber, IsString } from 'class-validator';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';

export class CreateFoodDto {
  @IsString()
  readonly title: string;

  @IsNumber({ allowInfinity: true, maxDecimalPlaces: 2 })
  readonly price: number;

  @IsNumber({ allowInfinity: true, maxDecimalPlaces: 2 })
  readonly weight: number;

  @IsString()
  readonly description: string;

  @IsNumber({ allowNaN: false, allowInfinity: false }, { each: true })
  ingredients: any[];

  @IsNumber({ allowNaN: false, allowInfinity: false })
  category: Category;

  createBy: User;
}
