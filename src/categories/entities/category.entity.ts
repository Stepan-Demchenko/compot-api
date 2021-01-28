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
import { Image } from '../../common/entities/image';

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'character', length: 10, nullable: true, unique: true })
  name: string;

  @OneToMany(() => Food, (food: Food) => food.category)
  foods: Food[];

  @ManyToOne(() => User, (user: User) => user.categories, { eager: false })
  createBy: User;

  @ManyToMany((type) => Image, (image: Image) => image.categories, { cascade: true })
  @JoinTable()
  images: Image[];
}
