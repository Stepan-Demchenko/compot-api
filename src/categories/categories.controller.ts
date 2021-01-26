import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { UserRole } from '../common/enums/user-role.enum';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { HttpResponse } from '../common/interfaces/http-response.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  // @Auth(UserRole.Admin, UserRole.Moderator)
  @UseGuards(JwtAuthGuard)
  create(@Body() createCategoryDto: CreateCategoryDto, @GetUser() user: User): Promise<HttpResponse<Category>> {
    return this.categoriesService.create(createCategoryDto, user);
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
