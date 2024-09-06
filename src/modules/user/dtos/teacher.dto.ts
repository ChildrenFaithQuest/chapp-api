import { Type } from 'class-transformer';
import { IsString, IsOptional, IsArray } from 'class-validator';

import { UserBaseDto } from './user-base.dto';
import { ParentDto } from './parent.dto';
import { ChurchDto } from '@app-modules/church/dtos/church.dto';
import { ClassDto } from '@app-modules/class/dtos/class.dto';
import { ContactInfoDto } from './contact-info.dto';

export class TeacherDto extends UserBaseDto {
  @IsOptional()
  @IsString()
  contact?: ContactInfoDto;

  @IsArray({})
  @Type(() => ClassDto)
  classes: ClassDto[];

  @Type(() => ChurchDto)
  church: ChurchDto;

  @Type(() => ParentDto)
  parent?: ParentDto;
}
