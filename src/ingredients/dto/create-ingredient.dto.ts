import { IsString } from 'class-validator';
import { Ingredient } from '../entities/ingredient.entity';

export class CreateIngredientDto extends Ingredient {
  @IsString()
  title: string;
}
