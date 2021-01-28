import { diskStorage } from 'multer';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { Category } from './entities/category.entity';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { IsCategoryNameUnique } from './dto/is-category-name-unique';
import { getFileName, MimeTypes, validateFileByMimeType } from '../common/utils/file-upload.utils';
import { ImageEntity } from '../common/entities/image.entity';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, IsCategoryNameUnique],
  imports: [
    TypeOrmModule.forFeature([Category, ImageEntity]),
    MulterModule.register({
      dest: './upload/images/categories',
      storage: diskStorage({
        destination: './upload/image',
        filename: getFileName,
      }),
      fileFilter: validateFileByMimeType([MimeTypes.PNG, MimeTypes.JPEG]),
    }),
    AuthModule,
    UsersModule,
  ],
})
export class CategoriesModule {}
