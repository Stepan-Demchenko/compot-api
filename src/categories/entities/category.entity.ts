import { Column, Entity, ManyToMany } from 'typeorm';
import { Food } from '../../foods/entities/food.entity';
import { BaseEntity } from '../../common/base.entity';

@Entity()
export class Category extends BaseEntity {
  @Column()
  name: string;

  @Column()
  img: string;

  @ManyToMany(() => Food, (food: Food) => food.categories)
  foods: Food[];
}
