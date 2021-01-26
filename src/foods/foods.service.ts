import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Food } from './entities/food.entity';
import { Event } from './entities/event.entity';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import arrayOfNumbersToArrayOfObjects from '../common/utils/arrayOfNumbersToArrayOfObjects';
import { HttpResponse } from '../common/interfaces/http-response.interface';
import { ResponseFactory } from '../common/factories/response-factory';
import { User } from '../users/entities/user.entity';
import { Connection, Repository, getRepository } from 'typeorm';

@Injectable()
export class FoodsService {
  constructor(
    @InjectRepository(Food) private readonly foodRepository: Repository<Food>,
    private readonly connection: Connection,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto): Promise<HttpResponse<Food[]>> {
    const total: number = await this.foodRepository.count();
    const foods: Food[] = await this.foodRepository
      .createQueryBuilder()
      .select()
      .from(Food, 'food')
      .skip(paginationQuery.offset || 0)
      .take(paginationQuery.limit || 10)
      .getMany();
    return ResponseFactory.success(foods, { total });
  }

  async findOne(id: number): Promise<HttpResponse<Food>> {
    const food = await this.foodRepository.findOne(id);
    if (!food) {
      throw new NotFoundException(`Food with id=${id} not found`);
    }
    return ResponseFactory.success(food);
  }

  async create(createFoodDto: CreateFoodDto, user: User): Promise<HttpResponse<Food>> {
    const newFood: CreateFoodDto = { ...createFoodDto, createBy: user };
    newFood.ingredients = arrayOfNumbersToArrayOfObjects(createFoodDto.ingredients as number[]);
    const food = this.foodRepository.create(newFood);
    const createdFood: Food = await this.foodRepository.save(food);
    return ResponseFactory.success(createdFood);
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

  async update(id: number, updateFoodDto: UpdateFoodDto): Promise<HttpResponse<Food>> {
    const food = await this.foodRepository.preload({
      id: id,
      ...updateFoodDto,
    });
    if (!food) {
      throw new NotFoundException(`Food with id=${id} not found`);
    }
    const updatedFood = await this.foodRepository.save(food);
    return ResponseFactory.success(updatedFood);
  }

  async remove(id: number): Promise<HttpResponse<Food>> {
    const food = await this.foodRepository.findOne(id);
    if (!food) {
      throw new NotFoundException(`Food with id=${id} not found`);
    }
    const removedFood = await this.foodRepository.remove(food);
    return ResponseFactory.success(removedFood);
  }
}
