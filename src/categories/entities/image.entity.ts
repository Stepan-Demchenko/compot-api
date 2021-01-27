import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Category } from './category.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'character', nullable: false })
  src: string;

  @Column({ type: 'character', nullable: false })
  originalName: string;

  @ManyToMany(() => Category, (category: Category) => category.images)
  categories: Category[];
}
