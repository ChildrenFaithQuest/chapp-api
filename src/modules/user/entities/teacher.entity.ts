import { Entity, JoinTable, ManyToOne } from 'typeorm';
import { Class } from '@class/entities/class.entity';
import { Church } from 'modules/church/entities/church.entity';
import { UserBase } from 'shared/user-base.entity';

@Entity()
export class Teacher extends UserBase {
  @ManyToOne(() => Class, (classEntity) => classEntity.teachers)
  @JoinTable()
  classes: Class;

  @ManyToOne(() => Church, (church) => church.teachers)
  church: Church;
}
