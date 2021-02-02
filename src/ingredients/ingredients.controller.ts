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
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { Ingredient } from './entities/ingredient.entity';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { GetUser } from '../common/decorators/get-user.decorator';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { HttpResponse } from '../common/interfaces/http-response.interface';
import { MulterFile } from '../common/interfaces/multer-file.interface';

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post()
  @Auth(UserRole.Admin, UserRole.Moderator)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('images'))
  create(
    @Body() createIngredientDto: CreateIngredientDto,
    @GetUser() user: User,
    @UploadedFile() file: MulterFile,
  ): Promise<void> {
    return this.ingredientsService.create(createIngredientDto, user, file);
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto): Promise<HttpResponse<Ingredient[]>> {
    return this.ingredientsService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<HttpResponse<Ingredient>> {
    return this.ingredientsService.findOne(id);
  }

  @Put(':id')
  @Auth(UserRole.Admin, UserRole.Moderator)
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(FileInterceptor('images'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIngredientDto: UpdateIngredientDto,
    @UploadedFile() file: MulterFile,
  ): Promise<void> {
    return this.ingredientsService.update(id, updateIngredientDto, file);
  }

  @Delete(':id')
  @Auth(UserRole.Admin, UserRole.Moderator)
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.ingredientsService.remove(id);
  }
}
