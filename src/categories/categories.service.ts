import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Category } from './entities/category.entity';
import { User } from '../users/entities/user.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { HttpResponse } from '../common/interfaces/http-response.interface';
import { ResponseFactory } from '../common/factories/response-factory';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, user: User): Promise<HttpResponse<Category>> {
    const newCategory: CreateCategoryDto = {
      ...createCategoryDto,
      createBy: user,
    };
    const category = this.categoryRepository.create(newCategory);
    const createdCategory = await this.categoryRepository.save(category);
    return ResponseFactory.success(createdCategory);
  }

  async findAll(paginationQuery: PaginationQueryDto): Promise<HttpResponse<Category[]>> {
    const total = await this.categoryRepository.count();
    const items = await this.categoryRepository.find({
      skip: +paginationQuery.offset || 0,
      take: +paginationQuery.limit || 10,
    });

    return ResponseFactory.success(items, { total });
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
