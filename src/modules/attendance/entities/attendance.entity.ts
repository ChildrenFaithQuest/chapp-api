import { Class } from '@app-modules/class/entities/class.entity';
import { Child } from '@app-modules/user/entities/child.entity';
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
  id: string;

  @Column({ type: 'date' })
  date: string; // YYYY-MM-DD

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

  @ManyToOne(() => Child, (child) => child.attendances)
  child: Child;

  @ManyToOne(() => Class, (classEntity) => classEntity.attendances)
  @JoinColumn()
  class: Class;
}
