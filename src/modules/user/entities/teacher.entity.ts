import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { Class } from '@app-modules/class/entities/class.entity';
import { ContactInfo } from '@app-modules/user/entities/contact-info.entity';
import { UserBase } from './user-base.entity';
import { Parent } from './parent.entity';
import { Organization } from '@app-modules/organization/entities/organization.entity';

@Entity()
export class Teacher extends UserBase {
  @Column(() => ContactInfo)
  contact: ContactInfo;

  @ManyToMany(() => Class)
  @JoinTable()
  classes: Class[];

  @ManyToOne(() => Organization, (org) => org.teachers)
  organization: Organization;

  @OneToOne(() => Parent, { nullable: true })
  @JoinColumn()
  parent?: Parent;
}
