import { Repository, InsertResult } from 'typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { HttpResponse } from '../common/interfaces/http-response.interface';
import { ResponseFactory } from '../common/factories/response-factory';
import { MulterFile } from '../common/interfaces/multer-file.interface';
import { User } from '../users/entities/user.entity';
import { SaveImageService } from '../common/services/save-image/save-image.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly saveImageService: SaveImageService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, user: User, file: MulterFile): Promise<HttpResponse<any>> {
    const idOfImage = await this.saveImageService.save(file);
    const createdCategory = await this.categoryRepository
      .createQueryBuilder()
      .insert()
      .values({ ...createCategoryDto, createBy: user })
      .update()
      .createQueryBuilder()
      .relation(Category, 'images')
      .of(Category)
      .add(14);
    // const test = await this.categoryRepository.create({ ...createCategoryDto, createBy: user, images: [idOfImage] });
    // await this.categoryRepository.save(test);
    return ResponseFactory.success('ee');
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

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  findOneByName(name: string) {
    return this.categoryRepository.findOne({ name });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
