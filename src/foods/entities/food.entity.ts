import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Ingredient } from './ingridient.entity';
import { Category } from './category.entity';

@Entity() //sql table === 'food'
export class Food extends BaseEntity {
  @Column()
  title: string;

  @Column()
  price: number;

  @Column()
  weight: number;

  @Column()
  img: string;

  @Column()
  description: string;

  @ManyToMany(() => Category)
  @JoinTable()
  category: number[];

  @ManyToMany(() => Ingredient)
  @JoinTable()
  ingredients: number[];
}
