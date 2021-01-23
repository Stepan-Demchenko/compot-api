import { IsString, Validate } from 'class-validator';
import { IsCategoryNameUnique } from './is-category-name-unique';

export class CreateCategoryDto {
  @IsString()
  @Validate(IsCategoryNameUnique, { message: 'Category name must be unique!' })
  name: string;
}
