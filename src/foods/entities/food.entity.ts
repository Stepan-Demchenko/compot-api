import { Column, Entity, JoinTable, ManyToMany, ManyToOne, RelationId } from 'typeorm';

import { Image } from '../../common/entities/image';
import { BaseEntity } from '../../common/base.entity';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Ingredient } from '../../ingredients/entities/ingredient.entity';

@Entity() //sql table === 'food'
export class Food extends BaseEntity {
  @Column({ type: 'character', length: 20, nullable: true })
  title: string;

  @Column({ type: 'real' })
  price: number;

  @Column({ type: 'real' })
  weight: number;

  @ManyToMany(() => Image, (image: Image) => image.foods)
  @JoinTable()
  images: Image[];

  @RelationId((food: Food) => food.images)
  imageIds: number[];

  @Column({ type: 'character', length: 500, nullable: true })
  description: string;

  @Column({ default: 0 })
  recommendations: number;

  @ManyToOne(() => Category, (category: Category) => category.foods, {
    nullable: true,
  })
  category: Category;

  @RelationId((food: Food) => food.category)
  categoryId: number;

  @ManyToMany(() => Ingredient, (ingredient: Ingredient) => ingredient.foods, {
    nullable: true,
  })
  @JoinTable()
  ingredients: Ingredient[];

  @RelationId((food: Food) => food.ingredients)
  ingredientIds: number[];

  @ManyToOne(() => User, (user: User) => user.foods)
  createBy: User;
}
