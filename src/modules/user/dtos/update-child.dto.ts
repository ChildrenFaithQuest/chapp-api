import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserGender } from '@app-types/module.types';
import { Type } from 'class-transformer';

export class UpdateChildDto {
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
