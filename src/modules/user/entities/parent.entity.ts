import { Column, Entity, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Child } from './child.entity';

@Entity()
export class Parent extends User {
  @Column()
  childCount: string;

  @OneToMany(() => Child, (child) => child.parent)
  children: Child[];
}
