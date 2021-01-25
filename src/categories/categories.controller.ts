import { Controller, Get, Post, Body, Query } from '@nestjs/common';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { HttpResponse } from '../common/interfaces/http-response.interface';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<HttpResponse<Category>> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto): Promise<HttpResponse<Category[]>> {
    return this.categoriesService.findAll(paginationQuery);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.categoriesService.findOne(+id);
  // }
  //
  // @Put(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCategoryDto: UpdateCategoryDto,
  // ) {
  //   return this.categoriesService.update(+id, updateCategoryDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.categoriesService.remove(+id);
  // }
}
