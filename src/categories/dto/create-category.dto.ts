import { IsString, Validate } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { IsCategoryNameUnique } from './is-category-name-unique';
import { ImageEntity } from '../../common/entities/image.entity';

export class CreateCategoryDto {
  @IsString()
  @Validate(IsCategoryNameUnique, { message: 'Category name must be unique!' })
  name: string;
  createBy: User;
  image: ImageEntity;
}
