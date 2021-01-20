import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserRole } from '../../common/enums/user-role.enum';

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

  @Column({ nullable: true })
  avatar: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true, select: false })
  salt: string;

  @Column()
  email: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.Client })
  role: UserRole;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createDateTime: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  lastChangedDateTime: Date;

  @BeforeInsert()
  setFullNameColumn() {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }
}
