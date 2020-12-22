import { BaseEntity } from './base.entity';
import { Column } from 'typeorm';

export class Ingredient extends BaseEntity {
  @Column()
  title: string;

  @Column()
  img: string;
}
