import { UserGender } from '@app-types/module.types';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth?: Date;

  @Column({
    type: 'enum',
    enum: UserGender,
  })
  gender: UserGender;

  @Column()
  password: string; // This will store the hashed password

  @CreateDateColumn()
  createdAt: Date; // Creation date

  @UpdateDateColumn()
  updatedAt: Date; // Last Updated date
}
