import { Class } from '@app-modules/class/entities/class.entity';
import { Child } from '@app-modules/user';
import { AttendanceStatus } from '@app-types/module.types';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  name: string;

  @Column()
  date: Date;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.ABSENT,
  })
  status: AttendanceStatus;

  @CreateDateColumn()
  createdAt: Date; // Creation date

  @UpdateDateColumn()
  updatedAt: Date; // Last Updated date

  @ManyToOne(() => Child, (child) => child.attendance)
  child: Child;

  @ManyToOne(() => Class, (classEntity) => classEntity.attendances)
  @JoinColumn()
  class: Class;
}
