import { IsString } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Image } from '../../common/entities/image';

export class CreateCategoryDto {
  @IsString()
  // @Validate(IsCategoryNameUnique, { message: 'Category name must be unique!' })
  name: string;
  createBy: User;
  image: Image;
}
