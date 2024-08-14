import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Parent } from './parent.entity';
import { Attendance } from '@app-modules/attendance/entities/attendance.entity';
import { Class } from '@app-modules/class/entities/class.entity';
import { UserBase } from './user-base.entity';

@Entity()
export class Child extends UserBase {
  @Column()
  grade: number;

  @ManyToOne(() => Parent, (parent) => parent.children)
  parent: Parent;

  @OneToMany(() => Attendance, (attendance) => attendance.child)
  attendance: Attendance[];

  @ManyToOne(() => Class, (classEntity) => classEntity.children)
  class: Class;
}
