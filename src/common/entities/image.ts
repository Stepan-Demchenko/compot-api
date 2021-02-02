import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Category } from '../../categories/entities/category.entity';
import { Ingredient } from '../../ingredients/entities/ingredient.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  src: string;

  @Column({ nullable: true })
  originalName: string;

  @ManyToMany(() => Category, (category: Category) => category.images)
  categories: Category[];

  @ManyToMany(() => Ingredient, (ingredient: Ingredient) => ingredient.images)
  ingredients: Ingredient[];
}
