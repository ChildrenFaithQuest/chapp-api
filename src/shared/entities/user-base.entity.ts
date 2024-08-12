import { User } from '@app-modules/user';
import { Entity, Column } from 'typeorm';

@Entity()
export class UserBase extends User {
  @Column()
  address: string;

  @Column()
  phoneNumber: string;
}
