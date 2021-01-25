import { Connection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Food } from './entities/food.entity';
import { Event } from './entities/event.entity';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response';
import arrayOfNumbersToArrayOfObjects from '../common/utils/arrayOfNumbersToArrayOfObjects';
import { User } from '../users/entities/user.entity';

@Injectable()
export class FoodsService {
  constructor(
    @InjectRepository(Food) private readonly foodRepository: Repository<Food>,
    private readonly connection: Connection,
  ) {}

  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponse<Food>> {
    const total = await this.foodRepository.count();
    const items = await this.foodRepository.find({
      skip: paginationQuery.offset || 0,
      take: paginationQuery.limit || 10,
    });

    return new PaginatedResponse<Food>(items, paginationQuery.limit, total);
  }

  async findOne(id: number): Promise<Food> {
    const food = await this.foodRepository.findOne(id);
    if (!food) {
      throw new NotFoundException(`Food with id=${id} not found`);
    }
    return food;
  }

  async create(createFoodDto: CreateFoodDto, user: User) {
    const newFood: CreateFoodDto = { ...createFoodDto, createBy: user };
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
    if (!food) {
      throw new NotFoundException(`Food with id=${id} not found`);
    }
    return this.foodRepository.remove(food);
  }
}
