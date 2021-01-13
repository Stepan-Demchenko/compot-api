import { Column, Entity, OneToMany } from 'typeorm';
import { Food } from '../../foods/entities/food.entity';
import { BaseEntity } from '../../common/base.entity';

@Entity()
export class Category extends BaseEntity {
  @Column()
  name: string;

  @Column()
  img: string;

  @OneToMany(() => Food, (food) => food.category)
  foods: Food[];
}
