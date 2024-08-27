import { Child } from '@app-modules/user/entities/child.entity';
import { Parent } from '@app-modules/user/entities/parent.entity';
import { Teacher } from '@app-modules/user/entities/teacher.entity';
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
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
