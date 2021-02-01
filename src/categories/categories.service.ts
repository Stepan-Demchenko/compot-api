import { Injectable } from '@nestjs/common';
import { Repository, InsertResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Category } from './entities/category.entity';
import { User } from '../users/entities/user.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ResponseFactory } from '../common/factories/response-factory';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { MulterFile } from '../common/interfaces/multer-file.interface';
import { HttpResponse } from '../common/interfaces/http-response.interface';
import { SaveImageService } from '../common/services/save-image/save-image.service';
import { Image } from '../common/entities/image';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    private readonly saveImageService: SaveImageService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, user: User, file: MulterFile): Promise<void> {
    const idOfImage: number = await this.saveImageService.save(file);
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
  }

  async findAll(paginationQuery: PaginationQueryDto): Promise<HttpResponse<Category[]>> {
    const total = await this.categoryRepository.count();
    const categories: Category[] = await this.categoryRepository
      .createQueryBuilder()
      .select()
      .from(Category, 'category')
      .skip(paginationQuery.offset || 0)
      .take(paginationQuery.limit || 10)
      .getMany();

    return ResponseFactory.success(categories, { total });
  }

  async findOne(id: number): Promise<HttpResponse<Category>> {
    const foundedCategory = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.images', 'image')
      .where('category.id = :id', { id })
      .getOne();
    return ResponseFactory.success(foundedCategory);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto, file?: MulterFile) {
    const foundedCategory = await this.findOne(id);
    if (file) {
      foundedCategory.data.images.map(async (image: Image) => this.saveImageService.update(file, image.id, image.src));
      await this.categoryRepository
        .createQueryBuilder()
        .update(Category)
        .set(updateCategoryDto)
        .where('id = :id', { id })
        .execute();
    } else {
      await this.categoryRepository
        .createQueryBuilder()
        .update(Category)
        .set(updateCategoryDto)
        .where('id = :id', { id })
        .execute();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
