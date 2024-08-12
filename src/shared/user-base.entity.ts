import { User } from '@user/entities';
import { Entity, Column } from 'typeorm';

@Entity()
export class UserBase extends User {
  @Column()
  address: string;

  @Column()
  phoneNumber: string;
}
