import { Attendance } from '@app-modules/attendance/entities/attendance.entity';
import { Church } from '@app-modules/church/entities/church.entity';
import { Child } from '@app-modules/user/entities/child.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  ageGroup: string;

  @Column({ type: 'json', nullable: true })
  schedule: {
    dayOfWeek?: string; // Example: "Sunday"
    time?: string; // Example: "10:00 AM"
    frequency?: string; // Example: "Weekly"
    additionalDetails?: string; // Example: "Starting from April"
  };

  @CreateDateColumn()
  createdAt: Date; // Creation date

  @UpdateDateColumn()
  updatedAt: Date; // Last Updated date

  @OneToMany(() => Child, (child) => child.class)
  children: Child[];

  @ManyToOne(() => Church, (church) => church.classes)
  church: Church;

  @OneToMany(() => Attendance, (attendance) => attendance.class)
  attendances: Attendance[];
}
