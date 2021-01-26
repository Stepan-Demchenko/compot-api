import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Ingredient } from './entities/ingredient.entity';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { HttpResponse } from '../common/interfaces/http-response.interface';
import { ResponseFactory } from '../common/factories/response-factory';
import { User } from '../users/entities/user.entity';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepository: Repository<Ingredient>,
  ) {}

  async create(createIngredientDto: CreateIngredientDto, user: User): Promise<HttpResponse<Ingredient>> {
    const ingredient = this.ingredientRepository.create({ ...createIngredientDto, createBy: user });
    const createdIngredient = await this.ingredientRepository.save(ingredient);
    return ResponseFactory.success(createdIngredient);
  }

  async findAll(paginationQuery: PaginationQueryDto): Promise<HttpResponse<Ingredient[]>> {
    const total: number = await this.ingredientRepository.count();
    const items: Ingredient[] = await this.ingredientRepository.find({
      skip: +paginationQuery.offset || 0,
      take: +paginationQuery.limit || 10,
    });

    return ResponseFactory.success(items, { total });
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
