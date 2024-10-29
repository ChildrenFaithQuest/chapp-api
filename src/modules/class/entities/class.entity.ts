import { Attendance } from '@app-modules/attendance/entities/attendance.entity';
import { Organization } from '@app-modules/organization/entities/organization.entity';
import { Child } from '@app-modules/user/entities/child.entity';
import { Teacher } from '@app-modules/user/entities/teacher.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
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

  @ManyToMany(() => Teacher)
  teachers?: Teacher[];

  @ManyToOne(() => Organization, (org) => org.classes)
  organization: Organization;

  @OneToMany(() => Attendance, (attendance) => attendance.class)
  attendances?: Attendance[];
}
