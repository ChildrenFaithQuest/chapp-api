import { Type } from 'class-transformer';
import { IsArray, IsDate, IsString } from 'class-validator';

import { ClassDto } from '@app-modules/class/dtos/class.dto';
import { TeacherDto } from '@app-modules/user/dtos/teacher.dto';

export class ChurchDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

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
