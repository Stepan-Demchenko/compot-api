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
import { SaveImageService } from '../common/services/save-image/save-image.service';
import { getFileName, MimeTypes, validateFileByMimeType } from '../common/utils/file-upload.utils';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, IsCategoryNameUnique, SaveImageService],
  imports: [
    TypeOrmModule.forFeature([Category]),
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
