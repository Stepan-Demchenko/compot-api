import { IsString } from 'class-validator';

export class MulterFileDto {
  @IsString()
  originalName: string;

  @IsString()
  path: string;
}
