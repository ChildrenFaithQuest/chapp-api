import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Church } from '@app-modules/church/entities/church.entity';
import { Class } from '@app-modules/class/entities/class.entity';
import { ContactInfo } from '@app-modules/user/entities/contact-info.entity';
import { UserBase } from './user-base.entity';
import { Parent } from './parent.entity';

@Entity()
export class Teacher extends UserBase {
  @Column(() => ContactInfo)
  contact: ContactInfo;

  @ManyToMany(() => Class)
  @JoinTable()
  classes: Class[];

  @ManyToOne(() => Church, (church) => church.teachers)
  church: Church;

  @OneToOne(() => Parent, { nullable: true })
  @JoinColumn()
  parent: Parent;
}
