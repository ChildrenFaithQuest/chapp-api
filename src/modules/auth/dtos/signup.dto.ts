import { UserGender, UserType } from '@app-types/module.types';
import { ContactInfoDto } from '@app-modules/user/dtos/contact-info.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SignupDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsEnum(UserType, {
    message: 'userType must be a valid enum value (parent, teacher, child)',
  })
  userType: UserType;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsOptional()
  @ApiPropertyOptional()
  contact?: ContactInfoDto;

  @IsOptional()
  @ApiProperty()
  @IsDate()
  @Type(() => Date) // Ensures proper transformation from string to Date
  dateOfBirth?: Date;

  @IsNotEmpty()
  @ApiProperty()
  @IsEnum(UserGender, {
    message: 'gender must be a valid enum value (female, male)',
  })
  gender: UserGender; // Add the missing gender property
}
