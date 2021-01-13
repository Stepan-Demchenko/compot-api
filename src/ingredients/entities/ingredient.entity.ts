import { Column, Entity, ManyToMany } from 'typeorm';
import { Food } from '../../foods/entities/food.entity';
import { BaseEntity } from '../../common/base.entity';

@Entity()
export class Ingredient extends BaseEntity {
  @Column()
  title: string;

  @Column()
  img: string;

  @ManyToMany(() => Food, (food: Food) => food.ingredients)
  foods: Food[];
}
