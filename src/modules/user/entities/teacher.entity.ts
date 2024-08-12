import { Entity, JoinTable, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Class } from '@class/entities/class.entity';
import { Church } from 'modules/church/entities/church.entity';

@Entity()
export class Teacher extends User {
  @ManyToOne(() => Class, (classEntity) => classEntity.teachers)
  @JoinTable()
  classes: Class;

  @ManyToOne(() => Church, (church) => church.teachers)
  church: Church;
}
