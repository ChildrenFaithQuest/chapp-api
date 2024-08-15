import { IsArray } from 'class-validator';
import { ContactInfoDto } from './contact-info.dto';
import { Class } from '@app-modules/class/entities/class.entity';
import { ApiProperty } from '@nestjs/swagger';
import { RegisterDto } from '@app-modules/auth/dtos/register.dto';

export class CreateTeacherDto extends RegisterDto {
  @ApiProperty()
  contact: ContactInfoDto;

  @IsArray()
  classes: Class[];
}
