import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { CommonModule } from '../common/common.module';
import { MulterModule } from '@nestjs/platform-express';
import { IngredientsService } from './ingredients.service';
import { Ingredient } from './entities/ingredient.entity';
import { IngredientsController } from './ingredients.controller';
import { getFileName, MimeTypes, validateFileByMimeType } from '../common/utils/file-upload.utils';

@Module({
  controllers: [IngredientsController],
  providers: [IngredientsService],
  imports: [
    TypeOrmModule.forFeature([Ingredient]),
    AuthModule,
    UsersModule,
    MulterModule.register({
      dest: './upload/images/categories',
      storage: diskStorage({
        destination: './upload/images/categories',
        filename: getFileName,
      }),
      fileFilter: validateFileByMimeType([MimeTypes.PNG, MimeTypes.JPEG]),
    }),
    CommonModule,
  ],
})
export class IngredientsModule {}
