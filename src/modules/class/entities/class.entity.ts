import { Church } from '@app-modules/church/entities/church.entity';
import { Child, Teacher } from '@app-modules/user';
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
