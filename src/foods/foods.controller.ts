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
  UseGuards,
} from '@nestjs/common';

import { Food } from './entities/food.entity';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

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
  @Roles(UserRole.Admin, UserRole.Moderator)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createFoodDto: CreateFoodDto) {
    await this.foodService.create(createFoodDto);
  }

  @Put(':id')
  @Roles(UserRole.Admin, UserRole.Moderator)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFoodDto: UpdateFoodDto,
  ) {
    await this.foodService.update(id, updateFoodDto);
  }

  @Delete(':id')
  @Roles(UserRole.Admin, UserRole.Moderator)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.foodService.remove(id);
  }
}
