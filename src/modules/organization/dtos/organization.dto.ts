import { Type } from 'class-transformer';
import { IsArray, IsDate, IsString, IsEnum } from 'class-validator';

import { ClassDto } from '@app-modules/class/dtos/class.dto';
import { TeacherDto } from '@app-modules/user/dtos/teacher.dto';
import { OrgType } from '@app-types/module.types';

export class OrgDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsEnum(OrgType, {
    message: 'orgType must be a valid enum value (school, church)',
  })
  type?: OrgType;

  @IsString()
  description: string;

  @IsString()
  address: string;

  @IsDate()
  @Type(() => Date)
  createdAt: Date; // Creation date

  @IsDate()
  @Type(() => Date)
  updatedAt: Date; // Last Updated date

  @IsArray({})
  @Type(() => TeacherDto)
  teachers: TeacherDto[];

  @IsArray({})
  @Type(() => ClassDto)
  classes: ClassDto[];
}
