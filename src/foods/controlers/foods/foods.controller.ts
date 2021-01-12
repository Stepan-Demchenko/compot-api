import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { CreateFoodDto } from '../../../dto/create-food.dto';
import { FoodsService } from '../../services/foods/foods.service';
import { PaginationQueryDto } from '../../../dto/pagination-query.dto';

@Controller('foods')
export class FoodsController {
  constructor(private readonly foodService: FoodsService) {}

  @Get()
  getAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.foodService.findAll(paginationQuery);
  }

  @Post()
  create(@Body() createFoodDto: CreateFoodDto): Promise<any> {
    return this.foodService.create(createFoodDto);
  }
}
