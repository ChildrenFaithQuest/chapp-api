import { Column } from 'typeorm';

export class ContactInfo {
  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  phoneNumber?: string;
}
