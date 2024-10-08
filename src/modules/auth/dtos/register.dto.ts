import { CreateUserDto } from '@app-modules/user/dtos/create-user.dto';
import { UserType } from '@app-types/module.types';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';

export class RegisterDto extends CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6) // Example length constraints for password
  password: string;

  @ApiProperty()
  @IsEnum(UserType, {
    message: 'userType must be a valid enum value (parent, teacher, child)',
  })
  userType: UserType;
}
