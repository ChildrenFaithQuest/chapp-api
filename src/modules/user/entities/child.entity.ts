import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Parent } from './parent.entity';

@Entity()
export class Child extends User {
  @Column()
  class: string;
  grade: number;

  @ManyToOne(() => Parent, (parent) => parent.children)
  parent: User;
}
