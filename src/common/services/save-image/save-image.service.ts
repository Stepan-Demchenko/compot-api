import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { getConnection, InsertResult } from 'typeorm';
import { ImageEntity } from '../../entities/image.entity';
import { MulterFile } from '../../interfaces/multer-file.interface';

@Injectable()
export class SaveImageService {
  async save(file: MulterFile): Promise<number> {
    try {
      const result: InsertResult = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(ImageEntity)
        .values({ originalName: file.originalname, src: file.path })
        .returning('id')
        .execute();
      return result.identifiers[0].id;
    } catch (e) {
      fs.rm(file.path, () => {
        throw new HttpException(`We can't save image, something went wrong! ${e}`, HttpStatus.NOT_MODIFIED);
      });
    }
  }
}
