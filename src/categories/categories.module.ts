import { diskStorage } from 'multer';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { Category } from './entities/category.entity';
import { CommonModule } from '../common/common.module';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { getFileName, MimeTypes, validateFileByMimeType } from '../common/utils/file-upload.utils';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [
    TypeOrmModule.forFeature([Category]),
    MulterModule.register({
      dest: './upload/images/categories',
      storage: diskStorage({
        destination: './upload/images/categories',
        filename: getFileName,
      }),
      fileFilter: validateFileByMimeType([MimeTypes.PNG, MimeTypes.JPEG]),
    }),
    AuthModule,
    UsersModule,
    CommonModule,
  ],
})
export class CategoriesModule {}
