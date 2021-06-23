import { IsString } from 'class-validator';
import { Ingredient } from '../entities/ingredient.entity';
import { User } from '../../users/entities/user.entity';

export class CreateIngredientDto extends Ingredient {
  @IsString()
  title: string;

  createBy: User;
}
