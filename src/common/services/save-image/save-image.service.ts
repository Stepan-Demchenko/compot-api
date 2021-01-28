import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { getConnection, InsertResult } from 'typeorm';
import { Image } from '../../entities/image';
import { MulterFile } from '../../interfaces/multer-file.interface';

@Injectable()
export class SaveImageService {
  async save(file: MulterFile): Promise<any> {
    try {
      const result: InsertResult = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Image)
        .values({ originalName: file.originalname, src: file.path })
        .returning('*')
        .execute();
      return result.generatedMaps[0];
    } catch (e) {
      fs.rm(file.path, () => {
        throw new HttpException(`We can't save image, something went wrong! ${e}`, HttpStatus.NOT_MODIFIED);
      });
    }
  }
}
