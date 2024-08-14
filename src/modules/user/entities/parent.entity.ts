import { Column, Entity, OneToMany } from 'typeorm';
import { Child } from './child.entity';
import { User } from './user.entity';
import { ContactInfo } from '@app-shared/entities/contact-info.entity';

@Entity()
export class Parent extends User {
  @Column(() => ContactInfo)
  contact: ContactInfo;

  @OneToMany(() => Child, (child) => child.parent)
  children: Child[];
}
