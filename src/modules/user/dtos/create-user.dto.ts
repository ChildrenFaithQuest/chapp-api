import { OmitType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { SignupDto } from '@app-modules/auth/dtos/signup.dto';

export class CreateUserDto extends OmitType(SignupDto, [
  'email',
  'password',
  'userType',
]) {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  appwriteId: string;
}
