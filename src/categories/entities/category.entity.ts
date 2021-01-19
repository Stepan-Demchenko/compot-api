import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Food } from '../../foods/entities/food.entity';
import { BaseEntity } from '../../common/base.entity';
import { CategoryImage } from './category-image.entity';

@Entity()
export class Category extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => Food, (food) => food.category)
  foods: Food[];

  @ManyToMany(
    () => CategoryImage,
    (categoryImage) => categoryImage.categories,
    { cascade: true },
  )
  @JoinTable()
  images: CategoryImage[];
}
