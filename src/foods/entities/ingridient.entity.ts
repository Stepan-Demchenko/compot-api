import { BaseEntity } from './base.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Food } from './food.entity';

@Entity()
export class Ingredient extends BaseEntity {
  @Column()
  title: string;

  @Column()
  img: string;

  @ManyToMany(() => Food, (food: Food) => food.ingredients)
  foods: Food[];
}
