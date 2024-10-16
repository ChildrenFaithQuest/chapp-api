import { Type } from 'class-transformer';
import { IsString, IsDate, IsArray, IsObject } from 'class-validator';

import { AttendanceDto } from '@app-modules/attendance/dtos/attendance.dto';
import { ChildDto } from '@app-modules/user/dtos/child.dto';
import { OrgDto } from '@app-modules/organization/dtos/organization.dto';

export class ClassDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  ageGroup: string;

  @IsObject()
  schedule?: {
    dayOfWeek?: string;
    time?: string;
    frequency?: string;
    additionalDetails?: string;
  };

  @IsDate()
  @Type(() => Date)
  createdAt: Date; // Creation date

  @IsDate()
  @Type(() => Date)
  updatedAt: Date; // Last Updated date

  @IsArray({})
  @Type(() => ChildDto)
  children?: ChildDto[];

  @Type(() => OrgDto)
  organization?: OrgDto;

  @IsArray({})
  @Type(() => AttendanceDto)
  attendances?: AttendanceDto[];
}
