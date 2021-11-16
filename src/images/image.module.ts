import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { File } from '../common/entities/file';
import { AwsFileService } from './aws-file.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [AwsFileService, ConfigService],
  imports: [TypeOrmModule.forFeature([File])],
  exports: [AwsFileService],
})
export class ImageModule {}
