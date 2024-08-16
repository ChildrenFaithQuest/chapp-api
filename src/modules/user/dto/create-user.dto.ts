import { UserGender } from '@app-types/module.types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsEnum,
} from 'class-validator';
import { ContactInfoDto } from './contact-info.dto';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsEnum(UserGender)
  gender: UserGender;

  @IsOptional()
  @ApiProperty()
  @IsDate()
  @Type(() => Date) // Ensures proper transformation from string to Date
  dateOfBirth?: Date;

  @IsOptional()
  @ApiPropertyOptional()
  contact?: ContactInfoDto;
}
