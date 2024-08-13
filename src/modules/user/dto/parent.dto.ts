import { IsArray } from 'class-validator';
import { UserBaseDto } from './user-base.dto';
import { Child } from '../entities';

export class ParentDto extends UserBaseDto {
  @IsArray()
  children: Child[];
}
