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

import { Food } from './entities/food.entity';
import { CreateFoodDto } from './dto/create-food.dto';
import { FoodsService } from './foods.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('foods')
export class FoodsController {
  constructor(private readonly foodService: FoodsService) {}

  @Get()
  getAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponse<Food>> {
    return this.foodService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Food> {
    return this.foodService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('foodImage'))
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createFoodDto: CreateFoodDto, @UploadedFile() file) {
    await this.foodService.create(createFoodDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFoodDto: UpdateFoodDto,
  ) {
    await this.foodService.update(id, updateFoodDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.foodService.remove(id);
  }
}