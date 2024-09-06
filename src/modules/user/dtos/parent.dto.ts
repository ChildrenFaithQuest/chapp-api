import { Type } from 'class-transformer';

import { IsString, IsOptional, IsArray } from 'class-validator';
import { UserBaseDto } from './user-base.dto';
import { ContactInfoDto } from './contact-info.dto';
import { ChildDto } from './child.dto';
import { TeacherDto } from './teacher.dto';

export class ParentDto extends UserBaseDto {
  @IsOptional()
  @IsString()
  contact?: ContactInfoDto;

  @IsArray({})
  @Type(() => ChildDto)
  children: ChildDto[];

  @Type(() => TeacherDto)
  teacher?: TeacherDto;
}
