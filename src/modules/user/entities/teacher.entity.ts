import { Column, Entity, JoinTable, ManyToOne } from 'typeorm';
import { Church } from '@app-modules/church/entities/church.entity';
import { Class } from '@app-modules/class/entities/class.entity';
import { UserBase } from '@app-shared/entities/user-base.entity';
import { User } from './user.entity';

@Entity()
export class Teacher extends User {
  @Column(() => UserBase)
  base: UserBase;

  @ManyToOne(() => Class, (classEntity) => classEntity.teachers)
  @JoinTable()
  classes: Class;

  @ManyToOne(() => Church, (church) => church.teachers)
  church: Church;
}
