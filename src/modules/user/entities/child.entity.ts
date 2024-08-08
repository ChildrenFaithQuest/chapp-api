import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Parent } from './parent.entity';
import { Attendance } from '@attendance/entities/attendance.entity';
import { Class } from '@class/entities/class.entity';

@Entity()
export class Child extends User {
  @Column()
  grade: number;

  @ManyToOne(() => Parent, (parent) => parent.children)
  parent: Parent;

  @OneToMany(() => Attendance, (attendance) => attendance.child)
  attendance: Attendance;

  @ManyToOne(() => Class, (classEntity) => classEntity.children)
  class: Class;
}
