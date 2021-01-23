import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Food } from '../../foods/entities/food.entity';
import { CategoryImage } from './category-image.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Food, (food) => food.category)
  foods: Food[];

  @ManyToMany(
    () => CategoryImage,
    (categoryImage) => categoryImage.categories,
    { cascade: true },
  )
  @JoinTable()
  images: CategoryImage[];
}
