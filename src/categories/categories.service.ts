import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response';
import { CategoryImage } from './entities/category-image.entity';
import { MulterFileDto } from './dto/file.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(CategoryImage)
    private readonly categoryImageRepository: Repository<CategoryImage>,
  ) {}

  create(createCategoryDto: CreateCategoryDto, file: MulterFileDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    const categoryImage = this.categoryImageRepository.create({
      originalName: file.originalname,
      src: file.path,
    });
    category.images = [categoryImage];
    return this.categoryRepository.save(category);
  }

  async findAll(
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponse<Category>> {
    const total = await this.categoryRepository.count();
    const items = await this.categoryRepository.find({
      skip: +paginationQuery.offset || 0,
      take: +paginationQuery.limit || 10,
    });

    return new PaginatedResponse<Category>(items, paginationQuery.limit, total);
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
