import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsString } from 'class-validator';

import { ClassDto } from '@app-modules/class/dtos/class.dto';
import { ChildDto } from '@app-modules/user/dtos/child.dto';
import { AttendanceStatus } from '@app-types/module.types';

export class AttendanceDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsEnum(AttendanceStatus, {
    message: 'status must be a valid enum value (present, absent)',
  })
  status: AttendanceStatus;

  @IsDate()
  @Type(() => Date)
  createdAt: Date; // Creation date

  @IsDate()
  @Type(() => Date)
  updatedAt: Date; // Last Updated date

  @Type(() => ChildDto)
  child: ChildDto;

  @Type(() => ClassDto)
  class: ClassDto;
}
