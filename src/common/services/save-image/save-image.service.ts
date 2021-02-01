import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { getConnection, InsertResult } from 'typeorm';

import { Image } from '../../entities/image';
import { MulterFile } from '../../interfaces/multer-file.interface';

@Injectable()
export class SaveImageService {
  async save(file: MulterFile): Promise<number> {
    try {
      const result: InsertResult = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Image)
        .values({ originalName: file.originalname, src: file.path })
        .returning('*')
        .execute();
      return +result.identifiers[0].id;
    } catch (e) {
      fs.unlink(file.path, () => {
        throw new HttpException(`We can't save image, something went wrong! ${e}`, HttpStatus.NOT_MODIFIED);
      });
    }
  }

  async update(file: MulterFile, id: number, oldFilePath: string): Promise<void> {
    try {
      fs.unlink(oldFilePath, () => null);
      await getConnection()
        .createQueryBuilder()
        .update(Image)
        .set({ originalName: file.originalname, src: file.path })
        .where('id = :id', { id })
        .execute();
    } catch (e) {
      fs.unlink(file.path, () => null);
      throw new HttpException(`We can't save image, something went wrong! ${e}`, HttpStatus.NOT_MODIFIED);
    }
  }
}
