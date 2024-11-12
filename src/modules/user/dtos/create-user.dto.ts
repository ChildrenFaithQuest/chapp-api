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
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  appwriteId?: string;

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
  @IsEnum(UserGender, {
    message: 'gender must be a valid enum value (female, male)',
  })
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
