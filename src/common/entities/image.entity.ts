import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Category } from '../../categories/entities/category.entity';

@Entity()
export class ImageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  src: string;

  @Column({ nullable: true })
  originalName: string;

  @ManyToMany(() => Category, (category: Category) => category.images)
  categories: Category[];
}
