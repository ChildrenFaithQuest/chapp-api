import { IsString } from 'class-validator';
import { UserDto } from './user.dto';

export class UserBaseDto extends UserDto {
  @IsString()
  address: string;

  @IsString()
  phoneNumber: string;
}
