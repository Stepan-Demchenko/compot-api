import {
  AfterLoad,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { UserRole } from '../../common/enums/user-role.enum';
import { Food } from '../../foods/entities/food.entity';
import { Ingredient } from '../../ingredients/entities/ingredient.entity';
import { Category } from '../../categories/entities/category.entity';
import { File } from '../../common/entities/file';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  fullName: string;

  @JoinColumn()
  @OneToOne(() => File, {
    eager: true,
    nullable: true,
  })
  public avatar?: File;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true, select: false })
  salt: string;

  @Column()
  email: string;

  @Column({ type: 'enum', enum: UserRole, nullable: true })
  role: UserRole;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createDateTime: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  lastChangedDateTime: Date;

  @OneToMany((type) => Food, (food: Food) => food.createBy)
  foods: Food[];

  @OneToMany((type) => Category, (category: Category) => category.createBy)
  categories: Category[];

  @OneToMany((type) => Ingredient, (ingredient: Ingredient) => ingredient.createBy)
  ingredients: Ingredient[];

  @AfterLoad()
  setFullNameColumn() {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }
}
