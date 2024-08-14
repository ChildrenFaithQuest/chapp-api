import { IsArray, IsOptional } from 'class-validator';
import { UserBaseDto } from './user-base.dto';
import { Child } from '../entities';
import { UserDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ParentDto extends UserDto {
  @ApiProperty()
  base: UserBaseDto;

  @IsArray()
  @IsOptional()
  children?: Child[];
}
