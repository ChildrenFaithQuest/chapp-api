import { Child } from 'src/modules/user/entities/child.entity';
import { Teacher } from 'src/modules/user/entities/teacher.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';

@Entity()
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

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
}
