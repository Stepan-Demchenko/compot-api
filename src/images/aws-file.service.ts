import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { Connection, InsertResult, Repository } from 'typeorm';

import { File } from '../common/entities/file';

@Injectable()
export class AwsFileService {
  private readonly S3: S3 = new S3();

  constructor(
    @InjectRepository(File) private readonly awsPublicFileRepository: Repository<File>,
    private readonly configService: ConfigService,
    private readonly connection: Connection,
  ) {}

  async uploadPublicFile(file: Express.Multer.File): Promise<InsertResult> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const uploadResult = await this.S3.upload({
        Bucket: this.configService.get<string>('AWS_PUBLIC_BUCKET_NAME_DEV'),
        Body: file.buffer,
        ContentType: 'image/jpeg',
        Key: `avatars/${uuid()}-${file.originalname.split('.')[0]}`,
      }).promise();
      const image = await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(File)
        .values({
          key: uploadResult.Key,
          url: uploadResult.Location,
        })
        .returning('*')
        .execute();
      await queryRunner.commitTransaction();
      return image;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(`We can't save image, something went wrong! ${e}`, HttpStatus.NOT_MODIFIED);
    } finally {
      await queryRunner.release();
    }
  }

  async deletePublicFile(id: string): Promise<void> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const file: File = await queryRunner.manager
        .getRepository(File)
        .createQueryBuilder()
        .where('file.id = :id', { id })
        .getOneOrFail();
      await queryRunner.manager
        .getRepository(File)
        .createQueryBuilder()
        .delete()
        .where('id = :id', { id: file.id })
        .execute();
      await this.S3.deleteObject({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME_DEV'),
        Key: file.key,
      }).promise();
      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(`We can't remove image, something went wrong! ${e}`, HttpStatus.NOT_MODIFIED);
    } finally {
      await queryRunner.release();
    }
  }
}
