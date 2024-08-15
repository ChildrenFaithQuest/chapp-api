import { IsArray, IsOptional } from 'class-validator';
import { ContactInfoDto } from './contact-info.dto';
import { Child } from '../entities';
import { ApiProperty } from '@nestjs/swagger';
import { RegisterDto } from '@app-modules/auth/dtos/register.dto';

export class ParentDetailsDto extends RegisterDto {
  @ApiProperty()
  contact: ContactInfoDto;

  @IsArray()
  @IsOptional()
  children?: Child[];
}
