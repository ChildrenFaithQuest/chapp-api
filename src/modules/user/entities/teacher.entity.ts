import { Entity, JoinTable, ManyToOne } from 'typeorm';
import { Church } from '@app-modules/church/entities/church.entity';
import { Class } from '@app-modules/class/entities/class.entity';
import { UserBase } from '@app-shared/entities/user-base.entity';

@Entity()
export class Teacher extends UserBase {
  @ManyToOne(() => Class, (classEntity) => classEntity.teachers)
  @JoinTable()
  classes: Class;

  @ManyToOne(() => Church, (church) => church.teachers)
  church: Church;
}
