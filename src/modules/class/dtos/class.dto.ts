import { Type } from 'class-transformer';
import { IsString, IsDate, IsArray } from 'class-validator';

import { AttendanceDto } from '@app-modules/attendance/dtos/attendance.dto';
import { ChurchDto } from '@app-modules/church/dtos/church.dto';
import { ChildDto } from '@app-modules/user/dtos/child.dto';

export class ClassDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  schedule: string;

  @IsDate()
  @Type(() => Date)
  createdAt: Date; // Creation date

  @IsDate()
  @Type(() => Date)
  updatedAt: Date; // Last Updated date

  @IsArray({})
  @Type(() => ChildDto)
  children: ChildDto[];

  @Type(() => ChurchDto)
  church: ChurchDto;

  @IsArray({})
  @Type(() => AttendanceDto)
  attendances: AttendanceDto[];
}
