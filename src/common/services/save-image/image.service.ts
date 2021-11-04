import * as fs from 'fs';
import { EntityManager, InsertResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { Image } from '../../entities/image';
import { MulterFile } from '../../interfaces/multer-file.interface';

@Injectable()
export class ImageService {
  constructor(@InjectRepository(Image) private readonly imageRepository: Repository<Image>) {}
  async save(manager: EntityManager, file: MulterFile): Promise<number> {
    try {
      const result: InsertResult = await manager
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

  async update(file: MulterFile, image: Image): Promise<void> {
    try {
      fs.unlink(image.src, () => null);
      await this.imageRepository
        .createQueryBuilder()
        .update(Image)
        .set({ originalName: file.originalname, src: file.path })
        .where('id = :id', { id: image.id })
        .execute();
    } catch (e) {
      fs.unlink(file.path, () => null);
      throw new HttpException(`We can't update image, something went wrong! ${e}`, HttpStatus.NOT_MODIFIED);
    }
  }

  async delete(image: Image): Promise<void> {
    try {
      fs.unlink(image.src, () => null);
      await this.imageRepository
        .createQueryBuilder()
        .delete()
        .from(Image)
        .where('id = :id', { id: image.id })
        .execute();
    } catch (e) {
      throw new HttpException(`We can't remove image, something went wrong! ${e}`, HttpStatus.NOT_MODIFIED);
    }
  }
}
