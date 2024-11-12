import { UserGender } from '@app-types/module.types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsDate,
  IsEnum,
} from 'class-validator';

export class UserBaseDto {
  @IsString()
  id: string;

  @IsString()
  appwriteId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  password: string;

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
}
