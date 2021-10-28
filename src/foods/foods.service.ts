import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InsertResult, Repository, Connection } from 'typeorm';

import { Food } from './entities/food.entity';
import { User } from '../users/entities/user.entity';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { ResponseFactory } from '../common/factories/response-factory';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { HttpResponse } from '../common/interfaces/http-response.interface';
import { ImageService } from '../common/services/save-image/image.service';
import { MulterFile } from '../common/interfaces/multer-file.interface';
import { Image } from '../common/entities/image';

@Injectable()
export class FoodsService {
  constructor(
    @InjectRepository(Food) private readonly foodRepository: Repository<Food>,
    private readonly imageService: ImageService,
    private readonly connection: Connection,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto): Promise<HttpResponse<Food[]>> {
    const total: number = await this.foodRepository.count();
    const foods: Food[] = await this.foodRepository
      .createQueryBuilder('food')
      .leftJoinAndSelect('food.images', 'image')
      .skip(paginationQuery.offset || 0)
      .take(paginationQuery.limit || 10)
      .getMany();
    return ResponseFactory.success(foods, { total });
  }

  async findOne(id: number): Promise<HttpResponse<Food>> {
    try {
      const foundedFood = await this.foodRepository
        .createQueryBuilder('food')
        .leftJoinAndSelect('food.images', 'image')
        .where('food.id=:id', { id })
        .getOneOrFail();
      return ResponseFactory.success(foundedFood);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async create(createFoodDto: CreateFoodDto, user: User, file: MulterFile): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const idOfImage: number = await this.imageService.save(queryRunner.manager, file);
      const idOfFood: InsertResult = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Food)
        .values({
          ...createFoodDto,
          createBy: user,
        })
        .returning('id')
        .execute();
      await queryRunner.manager
        .createQueryBuilder()
        .relation(Food, 'images')
        .of(+idOfFood.identifiers[0].id)
        .add(idOfImage);
      await queryRunner.manager
        .createQueryBuilder()
        .relation(Food, 'ingredients')
        .of(+idOfFood.identifiers[0].id)
        .add(createFoodDto.ingredients);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, updateFoodDto: UpdateFoodDto, file?: MulterFile): Promise<void> {
    const foundedFood: HttpResponse<Food> = await this.findOne(id);
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (file) {
        foundedFood.data.images.map(async (image: Image) => await this.imageService.update(file, image));
      }
      await queryRunner.manager
        .createQueryBuilder()
        .update(Food)
        .set({ ...updateFoodDto })
        .where('id = :id', { id })
        .execute();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number): Promise<any> {
    const foundedFood: HttpResponse<Food> = await this.findOne(id);
    try {
      const queryRunner = this.connection.createQueryRunner();
      await queryRunner.manager.createQueryBuilder().delete().from(Food).where('id = :id', { id }).execute();
      await this.imageService.delete(foundedFood.data.images[0]);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
