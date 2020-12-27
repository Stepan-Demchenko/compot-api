import { BaseEntity } from './base.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Food } from './food.entity';

@Entity()
export class Category extends BaseEntity {
  @Column()
  name: string;

  @Column()
  img: string;

  @ManyToMany(() => Food, (food: Food) => food.categories)
  foods: Food[];
}
