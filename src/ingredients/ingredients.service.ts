import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InsertResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Image } from '../common/entities/image';
import { User } from '../users/entities/user.entity';
import { Ingredient } from './entities/ingredient.entity';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { ResponseFactory } from '../common/factories/response-factory';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { MulterFile } from '../common/interfaces/multer-file.interface';
import { ImageService } from '../common/services/save-image/image.service';
import { HttpResponse } from '../common/interfaces/http-response.interface';

@Injectable()
export class IngredientsService {
  constructor(
    @InjectRepository(Ingredient) private readonly ingredientRepository: Repository<Ingredient>,
    private readonly imageService: ImageService,
  ) {}

  async create(createIngredientDto: CreateIngredientDto, user: User, file: MulterFile): Promise<void> {
    try {
      const idOfImage: number = await this.imageService.save(file);
      const idOfIngredient: InsertResult = await this.ingredientRepository
        .createQueryBuilder()
        .insert()
        .values({ ...createIngredientDto, createBy: user })
        .returning('id')
        .execute();
      await this.ingredientRepository
        .createQueryBuilder()
        .relation(Ingredient, 'images')
        .of(+idOfIngredient.identifiers[0].id)
        .add(idOfImage);
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(paginationQuery: PaginationQueryDto): Promise<HttpResponse<Ingredient[]>> {
    try {
      const total: number = await this.ingredientRepository.count();
      const items: Ingredient[] = await this.ingredientRepository
        .createQueryBuilder()
        .select()
        .from(Ingredient, 'ingredient')
        .skip(paginationQuery.offset || 0)
        .take(paginationQuery.limit || 10)
        .getMany();

      return ResponseFactory.success(items, { total });
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: number): Promise<HttpResponse<Ingredient>> {
    try {
      const foundedIngredient: Ingredient = await this.ingredientRepository
        .createQueryBuilder('ingredient')
        .leftJoinAndSelect('ingredient.images', 'images')
        .where('ingredient.id = :id', { id })
        .getOneOrFail();
      return ResponseFactory.success(foundedIngredient);
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateIngredientDto: UpdateIngredientDto, file: MulterFile): Promise<void> {
    const foundIngredient: HttpResponse<Ingredient> = await this.findOne(id);
    if (file) {
      try {
        foundIngredient.data.images.map(async (image: Image) => await this.imageService.update(file, image));
        await this.ingredientRepository
          .createQueryBuilder()
          .update(Ingredient)
          .set({ ...updateIngredientDto })
          .where('id=:id', { id })
          .execute();
      } catch (e) {
        throw new HttpException(e, HttpStatus.BAD_REQUEST);
      }
    } else {
      await this.ingredientRepository
        .createQueryBuilder()
        .update(Ingredient)
        .set({ ...updateIngredientDto })
        .where('id=:id', { id })
        .execute();
    }
  }

  async remove(id: number): Promise<void> {
    const foundedIngredient: HttpResponse<Ingredient> = await this.findOne(id);
    try {
      foundedIngredient.data.images.map(async (image: Image) => await this.imageService.delete(image));
      await this.ingredientRepository
        .createQueryBuilder()
        .delete()
        .where('id=:id', { id: foundedIngredient.data.id })
        .execute();
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
}
