import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { diskStorage } from 'multer';

import { Food } from './entities/food.entity';
import { FoodsService } from './foods.service';
import { Event } from './entities/event.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { FoodsController } from './foods.controller';
import { CommonModule } from '../common/common.module';
import { MulterModule } from '@nestjs/platform-express';
import { getFileName, MimeTypes, validateFileByMimeType } from '../common/utils/file-upload.utils';

@Module({
  controllers: [FoodsController],
  imports: [
    TypeOrmModule.forFeature([Food, Event]),
    MulterModule.register({
      dest: './upload/images/foods',
      storage: diskStorage({
        destination: './upload/images/foods',
        filename: getFileName,
      }),
      fileFilter: validateFileByMimeType([MimeTypes.PNG, MimeTypes.JPEG]),
    }),
    AuthModule,
    UsersModule,
    CommonModule,
  ],
  providers: [FoodsService],
})
export class FoodsModule {}
