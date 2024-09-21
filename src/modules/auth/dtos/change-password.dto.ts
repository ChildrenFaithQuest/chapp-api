import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @MinLength(8, { message: 'New password must be at least 8 characters long.' })
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/, {
    message:
      'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @MinLength(8)
  confirmNewPassword: string;
}
