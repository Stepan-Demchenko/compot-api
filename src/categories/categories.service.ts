import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InsertResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Image } from '../common/entities/image';
import { User } from '../users/entities/user.entity';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ResponseFactory } from '../common/factories/response-factory';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { MulterFile } from '../common/interfaces/multer-file.interface';
import { HttpResponse } from '../common/interfaces/http-response.interface';
import { ImageService } from '../common/services/save-image/image.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    private readonly imageService: ImageService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, user: User, file: MulterFile): Promise<void> {
    if (file) {
      try {
        const idOfImage: number = await this.imageService.save(file);
        const idOfCategory: InsertResult = await this.categoryRepository
          .createQueryBuilder()
          .insert()
          .values({ ...createCategoryDto, createBy: user })
          .returning('id')
          .execute();
        await this.categoryRepository
          .createQueryBuilder()
          .relation(Category, 'images')
          .of(+idOfCategory.identifiers[0].id)
          .add(idOfImage);
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
    } else {
      throw new HttpException('Image of category is required', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(paginationQuery: PaginationQueryDto): Promise<HttpResponse<Category[]>> {
    try {
      const total: number = await this.categoryRepository.count();
      const categories: Category[] = await this.categoryRepository
        .createQueryBuilder('category')
        .leftJoinAndSelect('category.images', 'image')
        .skip(paginationQuery.offset || 0)
        .take(paginationQuery.limit || 10)
        .getMany();
      return ResponseFactory.success(categories, { total });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: number): Promise<HttpResponse<Category>> {
    const foundedCategory: Category = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.images', 'image')
      .where('category.id = :id', { id })
      .getOneOrFail();
    return ResponseFactory.success(foundedCategory);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto, file?: MulterFile): Promise<void> {
    const foundedCategory: HttpResponse<Category> = await this.findOne(id);
    if (file) {
      foundedCategory.data.images.map(async (image: Image) => await this.imageService.update(file, image));
      await this.categoryRepository
        .createQueryBuilder()
        .update(Category)
        .set({ ...updateCategoryDto })
        .where('id = :id', { id })
        .execute();
    } else {
      await this.categoryRepository
        .createQueryBuilder()
        .update(Category)
        .set({ ...updateCategoryDto })
        .where('id = :id', { id })
        .execute();
    }
  }

  async remove(id: number): Promise<void> {
    const foundedCategory: HttpResponse<Category> = await this.findOne(id);
    if (foundedCategory.data.id) {
      foundedCategory.data.images.map(async (image: Image) => await this.imageService.delete(image));
      await this.categoryRepository
        .createQueryBuilder()
        .delete()
        .where('id = :id', { id: foundedCategory.data.id })
        .execute();
    }
  }
}
