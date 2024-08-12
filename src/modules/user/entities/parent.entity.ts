import { Entity, OneToMany } from 'typeorm';
import { Child } from './child.entity';
import { UserBase } from 'shared/user-base.entity';

@Entity()
export class Parent extends UserBase {
  @OneToMany(() => Child, (child) => child.parent)
  children: Child[];
}
