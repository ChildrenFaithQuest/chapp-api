import { Column, Entity, OneToMany } from 'typeorm';
import { Child } from './child.entity';
import { UserBase } from '@app-shared/entities/user-base.entity';
import { User } from './user.entity';

@Entity()
export class Parent extends User {
  @Column(() => UserBase)
  base: UserBase;

  @OneToMany(() => Child, (child) => child.parent)
  children: Child[];
}
