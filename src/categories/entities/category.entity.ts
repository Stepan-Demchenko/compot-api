import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Food } from '../../foods/entities/food.entity';
import { BaseEntity } from '../../common/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Category extends BaseEntity {
  @Column({ type: 'character', length: 10, nullable: true })
  name: string;

  @Column()
  img: string;

  @OneToMany(() => Food, (food: Food) => food.category)
  foods: Food[];

  @ManyToOne(() => User, (user: User) => user.categories, { eager: false })
  createBy: User;
}
