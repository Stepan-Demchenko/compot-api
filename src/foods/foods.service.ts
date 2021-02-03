import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InsertResult, Repository } from 'typeorm';

import { Food } from './entities/food.entity';
import { User } from '../users/entities/user.entity';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { ResponseFactory } from '../common/factories/response-factory';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { HttpResponse } from '../common/interfaces/http-response.interface';
import { ImageService } from '../common/services/save-image/image.service';
import { MulterFile } from '../common/interfaces/multer-file.interface';
import arrayOfNumbersToArrayOfObjects from '../common/utils/arrayOfNumbersToArrayOfObjects';

@Injectable()
export class FoodsService {
  constructor(
    @InjectRepository(Food) private readonly foodRepository: Repository<Food>,
    private readonly imageService: ImageService,
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

  async create(createFoodDto: CreateFoodDto, user: User, file: MulterFile): Promise<void> {
    createFoodDto.weight = +createFoodDto.weight;
    createFoodDto.price = +createFoodDto.price;

    // const newFood: CreateFoodDto = { ...createFoodDto, createBy: user };
    // newFood.ingredients = arrayOfNumbersToArrayOfObjects(createFoodDto.ingredients as number[]);
    // const food = this.foodRepository.create(newFood);
    // const createdFood: Food = await this.foodRepository.save(food);
    const idOfImage: number = await this.imageService.save(file);
    const idOfFood: InsertResult = await this.foodRepository
      .createQueryBuilder()
      .insert()
      .values({
        ...createFoodDto,
        createBy: user,
        ingredients: arrayOfNumbersToArrayOfObjects(createFoodDto.ingredients as number[]),
      })
      .returning('id')
      .execute();
    await this.foodRepository
      .createQueryBuilder()
      .relation(Food, 'images')
      .of(+idOfFood.identifiers[0].id)
      .add(idOfImage);
  }

  // async recommendFood(food: Food) {
  //   const queryRunner = this.connection.createQueryRunner();
  //
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //
  //   try {
  //     food.recommendations++;
  //
  //     const recommendEvent = new Event();
  //     recommendEvent.name = 'recommend_food';
  //     recommendEvent.type = 'food';
  //     recommendEvent.payload = { foodId: food.id };
  //
  //     await queryRunner.manager.save(food);
  //     await queryRunner.manager.save(recommendEvent);
  //
  //     await queryRunner.commitTransaction();
  //   } catch (err) {
  //     await queryRunner.rollbackTransaction();
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

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
