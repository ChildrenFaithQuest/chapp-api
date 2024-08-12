import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

import { Child } from '@user/entities/child.entity';
import { Teacher } from '@user/entities/teacher.entity';
import { Church } from 'modules/church/entities/church.entity';

@Entity()
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  schedule: string;

  @CreateDateColumn()
  createdAt: Date; // Creation date

  @UpdateDateColumn()
  updatedAt: Date; // Last Updated date

  @OneToMany(() => Child, (child) => child.class)
  children: Child;

  @ManyToMany(() => Teacher, (teacher) => teacher.classes)
  teachers: Teacher;

  @ManyToOne(() => Church, (church) => church.classes)
  church: Church;
}
