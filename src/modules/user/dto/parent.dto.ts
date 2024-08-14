import { IsArray, IsOptional } from 'class-validator';
import { ContactInfoDto } from './contact-info.dto';
import { Child } from '../entities';
import { UserDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ParentDto extends UserDto {
  @ApiProperty()
  contact: ContactInfoDto;

  @IsArray()
  @IsOptional()
  children?: Child[];
}
