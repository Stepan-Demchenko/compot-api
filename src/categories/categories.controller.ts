import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response';
import { Category } from './entities/category.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  getFileName,
  MimeTypes,
  validateFileByMimeType,
} from '../utils/file-upload.utils';
import { MulterFileDto } from '../common/dto/file.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('categoryImage', {
      storage: diskStorage({
        destination: './upload/category-images',
        filename: getFileName,
      }),
      fileFilter: validateFileByMimeType([MimeTypes.PNG, MimeTypes.JPEG]),
    }),
  )
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: MulterFileDto,
  ) {
    return this.categoriesService.create(createCategoryDto, file);
  }

  @Get()
  findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponse<Category>> {
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
