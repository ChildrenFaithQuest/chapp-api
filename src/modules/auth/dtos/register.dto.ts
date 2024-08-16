import { ContactInfoDto } from '@app-modules/user/dto/contact-info.dto';
import { UserBaseDto } from '@app-modules/user/dto/user-base';
import { UserType } from '@app-types/module.types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class RegisterDto extends UserBaseDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6) // Example length constraints for password
  password: string;

  @ApiProperty()
  @IsEnum(UserType)
  userType: UserType;

  @IsOptional()
  @ApiProperty()
  contact?: ContactInfoDto;
}