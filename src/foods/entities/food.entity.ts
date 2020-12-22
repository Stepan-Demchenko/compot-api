import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

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

  @Column('json', { nullable: true })
  type: any[];

  @Column('json', { nullable: true })
  ingredients: any[];
}
