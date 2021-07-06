import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Food } from '../../foods/entities/food.entity';
import { BaseEntity } from '../../common/base.entity';
import { User } from '../../users/entities/user.entity';
import { StatusOrder } from '../../common/enums/status-order.enum';
import { PaymentType } from '../../common/enums/payment-type.enum';

@Entity()
export class Order extends BaseEntity {
  @ManyToMany(() => Food)
  @JoinTable()
  foods: Food[];

  @ManyToOne(() => User, (user: User) => user.order)
  client: User;

  @Column({ type: 'enum', enum: StatusOrder, nullable: true })
  status: StatusOrder;

  @Column('float')
  price: number;

  @Column({ type: 'enum', enum: PaymentType, nullable: true })
  paymentType: PaymentType;

  @Column('varchar', { length: 200 })
  comment: string;
}
