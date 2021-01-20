import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';

import { Ingredient } from './entities/ingredient.entity';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post()
  @Roles(UserRole.Admin, UserRole.Moderator)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.ingredientsService.create(createIngredientDto);
  }

  @Get()
  findAll(
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginatedResponse<Ingredient>> {
    return this.ingredientsService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ingredientsService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.Admin, UserRole.Moderator)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    return this.ingredientsService.update(id, updateIngredientDto);
  }

  @Delete(':id')
  @Roles(UserRole.Admin, UserRole.Moderator)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ingredientsService.remove(id);
  }
}
