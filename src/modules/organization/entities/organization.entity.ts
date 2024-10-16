import { Class } from '@app-modules/class/entities/class.entity';
import { Teacher } from '@app-modules/user/entities/teacher.entity';
import { OrgType } from '@app-types/module.types';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: OrgType,
    nullable: true,
  })
  type?: OrgType;

  @Column({ nullable: true })
  description: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  registrationDate?: Date; // The date when the organization was registered

  @CreateDateColumn()
  createdAt: Date; // Creation date

  @UpdateDateColumn()
  updatedAt: Date; // Last Updated date

  @OneToMany(() => Teacher, (teacher) => teacher.organization)
  teachers: Teacher[];

  @OneToMany(() => Class, (teacher) => teacher.organization)
  classes: Class[];
}
