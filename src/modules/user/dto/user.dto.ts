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

export class UserDto {
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
  @IsEnum(UserGender)
  gender: UserGender;

  @IsOptional()
  @IsDate()
  @Type(() => Date) // Ensures proper transformation from string to Date
  dateOfBirth?: Date;
}
