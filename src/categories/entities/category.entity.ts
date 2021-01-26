import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Food } from '../../foods/entities/food.entity';
import { User } from '../../users/entities/user.entity';
import { CategoryImage } from './category-image.entity';

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'character', length: 10, nullable: true })
  name: string;

  @OneToMany(() => Food, (food: Food) => food.category)
  foods: Food[];

  @ManyToOne(() => User, (user: User) => user.categories, { eager: false })
  createBy: User;

  @ManyToMany(() => CategoryImage, (categoryImage) => categoryImage.categories, { cascade: true })
  @JoinTable()
  images: CategoryImage[];
}
