import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Food } from '../../entities/food.entity';
import { CreateFoodDto } from '../../dto/create-food.dto';
import { UpdateFoodDto } from '../../dto/update-food.dto';

@Injectable()
export class FoodsService {
  constructor(
    @InjectRepository(Food) private readonly foodRepository: Repository<Food>,
  ) {}

  findAll(): Promise<Food[]> {
    return this.foodRepository.find({
      relations: ['categories', 'ingredients'],
    });
  }

  async findOne(id: string) {
    const food = await this.foodRepository.findOne(id);
    if (!food) {
      throw new NotFoundException(`Food with id=${id} not found`);
    }
    return food;
  }

  async create(createFoodDto: CreateFoodDto) {
    const food = this.foodRepository.create(createFoodDto);
    return this.foodRepository.save(food);
  }

  async update(id: string, updateFoodDto: UpdateFoodDto) {
    const food = await this.foodRepository.preload({
      id: +id,
      ...updateFoodDto,
    });
    if (!food) {
      throw new NotFoundException(`Food with id=${id} not found`);
    }
    return this.foodRepository.save(food);
  }

  async remove(id: string) {
    const food = await this.foodRepository.findOne(id);
    return this.foodRepository.remove(food);
  }
}
