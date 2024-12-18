import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Parent } from './parent.entity';
import { Attendance } from '@app-modules/attendance/entities/attendance.entity';
import { Class } from '@app-modules/class/entities/class.entity';
import { UserBase } from './user-base.abstract';

@Entity()
export class Child extends UserBase {
  @Column({ nullable: true })
  grade?: number;

  @ManyToOne(() => Parent, (parent) => parent.children)
  parent?: Parent;

  @OneToMany(() => Attendance, (attendance) => attendance.child)
  attendances?: Attendance[];

  @ManyToOne(() => Class, (classEntity) => classEntity.children)
  class: Class;
}
