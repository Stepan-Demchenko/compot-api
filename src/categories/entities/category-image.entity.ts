import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class CategoryImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  src: string;

  @Column()
  originalName: string;

  @ManyToMany(() => Category, (category) => category.images)
  categories: Category[];
}
