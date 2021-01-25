import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from './entities/ingredient.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { HttpResponse } from '../common/interfaces/http-response.interface';

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post()
  create(@Body() createIngredientDto: CreateIngredientDto): Promise<HttpResponse<Ingredient>> {
    return this.ingredientsService.create(createIngredientDto);
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto): Promise<HttpResponse<Ingredient[]>> {
    return this.ingredientsService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ingredientsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateIngredientDto: UpdateIngredientDto) {
    return this.ingredientsService.update(id, updateIngredientDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ingredientsService.remove(id);
  }
}
