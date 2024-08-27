import { Type } from 'class-transformer';
import { IsString, IsOptional, IsArray } from 'class-validator';

import { UserBaseDto } from './user-base.dto';
import { ParentDto } from './parent.dto';
import { ClassDto } from '@app-modules/class/dtos/class.dto';
import { AttendanceDto } from '@app-modules/attendance/dtos/attendance.dto';

export class ChildDto extends UserBaseDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  parent?: ParentDto;

  @IsArray({})
  @Type(() => AttendanceDto) // Important for nested validation
  attendance: AttendanceDto[];

  @Type(() => ClassDto) // Important for nested validation
  class: ClassDto;
}
