import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { Food } from '../../foods/entities/food.entity';
import { BaseEntity } from '../../common/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Ingredient extends BaseEntity {
  @Column()
  title: string;

  @Column()
  img: string;

  @ManyToMany(() => Food, (food: Food) => food.ingredients)
  foods: Food[];

  @ManyToOne(() => User, (user: User) => user.ingredients)
  createBy: User;
}
