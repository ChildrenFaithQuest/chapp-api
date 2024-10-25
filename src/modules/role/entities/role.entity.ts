import { Auth } from '@app-modules/auth/entities/auth.entity';
import { Permission, RoleType } from '@app-types/role.types';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    type: 'enum',
    enum: RoleType,
    default: RoleType.GUEST,
  })
  name: RoleType; // e.g., 'Admin', 'Teacher', 'Parent'

  @Column({ type: 'enum', array: true, enum: Permission })
  permissions: Permission[]; // List of permission strings like 'manage_users', 'view_classes'

  @ManyToMany(() => Auth, (auth) => auth.roles)
  users?: Auth[]; // Auth users assigned this role

  @CreateDateColumn()
  createdAt: Date; // Creation date

  @UpdateDateColumn()
  updatedAt: Date; // Last Updated date
}
