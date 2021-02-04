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
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { Food } from './entities/food.entity';
import { FoodsService } from './foods.service';
import { User } from '../users/entities/user.entity';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { GetUser } from '../common/decorators/get-user.decorator';
import { MulterFile } from '../common/interfaces/multer-file.interface';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { HttpResponse } from '../common/interfaces/http-response.interface';
import { CreateFoodPipe } from './pipes/create-food.pipe';

@Controller('foods')
export class FoodsController {
  constructor(private readonly foodService: FoodsService) {}

  @Get()
  getAll(@Query() paginationQuery: PaginationQueryDto): Promise<HttpResponse<Food[]>> {
    return this.foodService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<HttpResponse<Food>> {
    return this.foodService.findOne(id);
  }

  @Post()
  @UsePipes(new CreateFoodPipe())
  @Auth(UserRole.Admin, UserRole.Moderator)
  @UseInterceptors(FileInterceptor('images'))
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createFoodDto: CreateFoodDto, @GetUser() user: User, @UploadedFile() file: MulterFile) {
    return this.foodService.create(createFoodDto, user, file);
  }

  @Put(':id')
  @Auth(UserRole.Admin, UserRole.Moderator)
  @UseInterceptors(FileInterceptor('images'))
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFoodDto: UpdateFoodDto,
    @UploadedFile() file: MulterFile,
  ) {
    await this.foodService.update(id, updateFoodDto);
  }

  @Delete(':id')
  @Auth(UserRole.Admin, UserRole.Moderator)
  @HttpCode(HttpStatus.ACCEPTED)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.foodService.remove(id);
  }
}
