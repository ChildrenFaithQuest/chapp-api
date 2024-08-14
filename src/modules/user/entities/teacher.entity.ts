import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Church } from '@app-modules/church/entities/church.entity';
import { Class } from '@app-modules/class/entities/class.entity';
import { User } from './user.entity';
import { ContactInfo } from '@app-shared/entities/contact-info.entity';

@Entity()
export class Teacher extends User {
  @Column(() => ContactInfo)
  contact: ContactInfo;

  @ManyToMany(() => Class)
  @JoinTable()
  classes: Class[];

  @ManyToOne(() => Church, (church) => church.teachers)
  church: Church;
}
