import { Body, Controller, Post } from '@nestjs/common';
import { IngredientsService } from '../../services/ingredients/ingredients.service';
import { CreateIngredientDto } from '../../../dto/create-ingredient.dto';
import { Ingredient } from '../../entities/ingridient.entity';

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientService: IngredientsService) {}

  @Post()
  create(
    @Body() createIngredientDto: CreateIngredientDto,
  ): Promise<Ingredient> {
    return this.ingredientService.create(createIngredientDto);
  }
}
