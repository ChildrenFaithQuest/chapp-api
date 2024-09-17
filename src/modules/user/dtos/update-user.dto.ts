import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ContactInfoDto } from './contact-info.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserGender } from '@app-types/module.types';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @IsOptional()
  @ApiPropertyOptional()
  contact: ContactInfoDto;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional({ description: 'firstname of the user' })
  firstName: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @ApiPropertyOptional()
  lastName: string;

  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional()
  @IsEnum(UserGender, {
    message: 'gender must be a valid enum value (female, male)',
  })
  gender: UserGender;

  @IsOptional()
  @ApiPropertyOptional()
  @IsDate()
  @Type(() => Date) // Ensures proper transformation from string to Date
  dateOfBirth: Date;
}
