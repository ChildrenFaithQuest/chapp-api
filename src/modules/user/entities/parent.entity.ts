import { Column, Entity, OneToMany } from 'typeorm';
import { Child } from './child.entity';
import { ContactInfo } from '@app-modules/user/entities/contact-info.entity';
import { UserBase } from './user-base.entity';

@Entity()
export class Parent extends UserBase {
  @Column(() => ContactInfo)
  contact: ContactInfo;

  @OneToMany(() => Child, (child) => child.parent)
  children?: Child[];
}
