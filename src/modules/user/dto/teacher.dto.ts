import { IsArray } from 'class-validator';
import { UserBaseDto } from './user-base.dto';
import { Class } from '@app-modules/class/entities/class.entity';
import { UserDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class TeacherDto extends UserDto {
  @ApiProperty()
  base: UserBaseDto;

  @IsArray()
  classes: Class[];
}
