import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

import { Food } from '../../entities/food.entity';
import { CreateFoodDto } from '../../dto/create-food.dto';
import { UpdateFoodDto } from '../../dto/update-food.dto';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { Event } from '../../entities/event.entity';
import arrayOfNumbersToArrayOfObjects from '../../../common/utils/arrayOfNumbersToArrayOfObjects';

@Injectable()
export class FoodsService {
  constructor(
    @InjectRepository(Food) private readonly foodRepository: Repository<Food>,
    private readonly connection: Connection,
  ) {}

  findAll(paginationQuery: PaginationQueryDto): Promise<Food[]> {
    return this.foodRepository.find({
      relations: ['categories'],
      skip: paginationQuery.offset,
      take: paginationQuery.limit,
    });
  }

  async findOne(id: number) {
    const food = await this.foodRepository.findOne(id);
    if (!food) {
      throw new NotFoundException(`Food with id=${id} not found`);
    }
    return food;
  }

  async create(createFoodDto: CreateFoodDto) {
    const newFood: CreateFoodDto = { ...createFoodDto };
    newFood.ingredients = arrayOfNumbersToArrayOfObjects(
      createFoodDto.ingredients as number[],
    );
    const food = this.foodRepository.create(newFood);
    return this.foodRepository.save(food);
  }

  async recommendFood(food: Food) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      food.recommendations++;

      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_food';
      recommendEvent.type = 'food';
      recommendEvent.payload = { foodId: food.id };

      await queryRunner.manager.save(food);
      await queryRunner.manager.save(recommendEvent);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, updateFoodDto: UpdateFoodDto): Promise<Food> {
    const food = await this.foodRepository.preload({
      id: id,
      ...updateFoodDto,
    });
    if (!food) {
      throw new NotFoundException(`Food with id=${id} not found`);
    }
    return this.foodRepository.save(food);
  }

  async remove(id: number): Promise<Food> {
    const food = await this.foodRepository.findOne(id);
    return this.foodRepository.remove(food);
  }
}
