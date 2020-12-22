import { Body, Controller, Get, Post } from '@nestjs/common';
import { FoodsService } from '../../services/foods/foods.service';
import { Food } from '../../entities/food.entity';
import { CreateFoodDto } from '../../dto/create-food.dto';

@Controller('foods')
export class FoodsController {
  constructor(private readonly foodService: FoodsService) {}

  @Get()
  getAll(): Promise<Food[]> {
    return this.foodService.findAll();
  }

  @Post()
  create(@Body() createFoodDto: CreateFoodDto): Promise<Food> {
    return this.foodService.create(createFoodDto);
  }
}
