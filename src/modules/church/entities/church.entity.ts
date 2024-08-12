import { Class } from '@class/entities/class.entity';
import { Teacher } from '@user/entities';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Church {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  address: string;

  @CreateDateColumn()
  createdAt: Date; // Creation date

  @UpdateDateColumn()
  updatedAt: Date; // Last Updated date

  @OneToMany(() => Teacher, (teacher) => teacher.church)
  teachers: Teacher;

  @OneToMany(() => Class, (teacher) => teacher.church)
  classes: Teacher;
}