import { Type } from 'class-transformer';
import { IsString, IsOptional, IsArray } from 'class-validator';

import { UserBaseDto } from './user-base.dto';
import { Parent } from '../entities/parent.entity';
import { ParentDto } from './parent.dto';
import { ChurchDto } from '@app-modules/church/dtos/church.dto';
import { ClassDto } from '@app-modules/class/dtos/class.dto';

export class TeacherDto extends UserBaseDto {
  @IsOptional()
  @IsString()
  contact?: Parent;

  @IsArray({})
  @Type(() => ClassDto)
  classes: ClassDto[];

  @Type(() => ChurchDto)
  church: ChurchDto;

  @Type(() => ParentDto)
  parent: ParentDto;
}
