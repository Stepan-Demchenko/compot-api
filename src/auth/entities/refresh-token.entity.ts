import { Column, Entity } from 'typeorm';

@Entity()
export class RefreshToken {
  @Column()
  user_id: number;

  @Column()
  is_revoked: boolean;

  @Column()
  expires: Date;
}
