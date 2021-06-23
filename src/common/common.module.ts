import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Image } from './entities/image';
import { ImageService } from './services/save-image/image.service';

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  providers: [ImageService],
  exports: [ImageService],
})
export class CommonModule {}
