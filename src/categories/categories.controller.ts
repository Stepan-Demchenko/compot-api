import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { User } from '../users/entities/user.entity';
import { Category } from './entities/category.entity';
import { Auth } from '../auth/decorators/auth.decorator';
import { CategoriesService } from './categories.service';
import { UserRole } from '../common/enums/user-role.enum';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetUser } from '../common/decorators/get-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { MulterFile } from '../common/interfaces/multer-file.interface';
import { HttpResponse } from '../common/interfaces/http-response.interface';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Auth(UserRole.Admin, UserRole.Moderator)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @GetUser() user: User,
    @UploadedFile() file: MulterFile,
  ): Promise<void> {
    return this.categoriesService.create(createCategoryDto, user, file);
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto): Promise<HttpResponse<Category[]>> {
    return this.categoriesService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<HttpResponse<Category>> {
    return this.categoriesService.findOne(id);
  }

  @Put(':id')
  @Auth(UserRole.Admin, UserRole.Moderator)
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() file: MulterFile,
  ): Promise<void> {
    return this.categoriesService.update(id, updateCategoryDto, file);
  }

  @Delete(':id')
  @Auth(UserRole.Admin, UserRole.Moderator)
  @HttpCode(HttpStatus.ACCEPTED)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoriesService.remove(id);
  }
}
