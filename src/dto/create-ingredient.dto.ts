import { IsString } from 'class-validator';

export class CreateIngredientDto {
  @IsString()
  title: string;

  @IsString()
  img: string;
}
