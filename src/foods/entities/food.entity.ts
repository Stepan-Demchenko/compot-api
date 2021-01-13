import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  RelationId,
} from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Category } from '../../categories/entities/category.entity';
import { Ingredient } from '../../ingredients/entities/ingredient.entity';

@Entity() //sql table === 'food'
export class Food extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'real' })
  price: number;

  @Column({ type: 'real' })
  weight: number;

  @Column()
  imgSrc: string;

  @Column()
  description: string;

  @Column({ default: 0 })
  recommendations: number;

  @ManyToOne(() => Category, (category: Category) => category.foods)
  category: Category;

  @RelationId((food: Food) => food.category)
  categoryId: number;

  @ManyToMany(
    (type) => Ingredient,
    (ingredient: Ingredient) => ingredient.foods,
  )
  @JoinTable()
  ingredients: Ingredient[];

  @RelationId((food: Food) => food.ingredients)
  ingredientIds: number[];
}
