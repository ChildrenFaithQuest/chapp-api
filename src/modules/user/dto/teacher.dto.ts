import { IsArray } from 'class-validator';
import { ContactInfoDto } from './contact-info.dto';
import { Class } from '@app-modules/class/entities/class.entity';
import { UserDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class TeacherDto extends UserDto {
  @ApiProperty()
  contact: ContactInfoDto;

  @IsArray()
  classes: Class[];
}
