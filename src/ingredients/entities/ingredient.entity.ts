import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Food } from '../../foods/entities/food.entity';
import { BaseEntity } from '../../common/base.entity';
import { User } from '../../users/entities/user.entity';
import { Image } from '../../common/entities/image';

@Entity()
export class Ingredient extends BaseEntity {
  @Column({ type: 'character', length: 10, nullable: true })
  title: string;

  @ManyToMany((type) => Image, (image: Image) => image.ingredients)
  @JoinTable()
  images: Image[];

  @ManyToMany(() => Food, (food: Food) => food.ingredients)
  foods: Food[];

  @ManyToOne(() => User, (user: User) => user.ingredients)
  createBy: User;
}
