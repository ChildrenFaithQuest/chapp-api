import { Child, Parent, Teacher } from '@app-modules/user';
import { UserType } from '@app-types/module.types';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserType })
  userType: UserType;

  @OneToOne(() => Parent, { nullable: true })
  @JoinColumn()
  parent?: Parent;

  @OneToOne(() => Child, { nullable: true })
  @JoinColumn()
  child?: Child;

  @OneToOne(() => Teacher, { nullable: true })
  @JoinColumn()
  teacher?: Teacher;
}
