import { IsString } from 'class-validator';
import { User } from '../../users/entities/user.entity';

export class CreateCategoryDto {
  @IsString()
  name: string;
  createBy: User;
}
