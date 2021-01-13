import { Column, Entity, JoinTable, ManyToMany, RelationId } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Ingredient } from '../../ingredients/entities/ingredient.entity';
import { Category } from '../../categories/entities/category.entity';

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

  @ManyToMany((type) => Category, (category: Category) => category.foods)
  @JoinTable()
  categories: Category[];

  @RelationId((food: Food) => food.categories)
  categoryIds: number[];

  @ManyToMany(
    (type) => Ingredient,
    (ingredient: Ingredient) => ingredient.foods,
  )
  @JoinTable()
  ingredients: Ingredient[];

  @RelationId((food: Food) => food.ingredients)
  ingredientIds: number[];
}
