import { IsString } from 'class-validator';

export class MulterFileDto {
  @IsString()
  originalname: string;

  @IsString()
  path: string;
}
