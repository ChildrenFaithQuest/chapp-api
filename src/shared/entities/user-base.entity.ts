import { Entity, Column } from 'typeorm';

@Entity()
export class UserBase {
  @Column()
  address: string;

  @Column()
  phoneNumber: string;
}
