import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { SignupDto } from './signup.dto';

export class RegisterDto extends OmitType(SignupDto, [
  'contact',
  'dateOfBirth',
  'gender',
  'firstName',
  'lastName',
]) {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}
