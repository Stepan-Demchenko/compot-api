import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { CreateIngredientDto } from './dto/create-ingredient.dto';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
  ) {}

  create(createIngredientDto: CreateIngredientDto) {
    const ingredient = this.ingredientRepository.create(createIngredientDto);
    return this.ingredientRepository.save(ingredient);
  }

  findAll() {
    return `This action returns all ingredients`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ingredient`;
  }

  update(id: number, updateIngredientDto: UpdateIngredientDto) {
    return `This action updates a #${id} ingredient`;
  }

  remove(id: number) {
    return `This action removes a #${id} ingredient`;
  }
}
