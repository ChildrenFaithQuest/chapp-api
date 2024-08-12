import { Controller, Post, Body, Get } from '@nestjs/common';
import { UsersService } from '../services/user.service';
import { UserBaseDto } from '../dto/user-base.dto';
import { User } from '../entities';

@Controller('user-details')
export class UserDetailsController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async submitForm(@Body() userDetailsDto: UserBaseDto): Promise<User> {
    return this.usersService.create(userDetailsDto);
  }

  @Get()
  async getAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
