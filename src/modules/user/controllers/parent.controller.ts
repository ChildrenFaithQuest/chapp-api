import { Controller, Post, Body, Get } from '@nestjs/common';
import { UsersService } from '../services/parent.service';
import { User } from '../entities';
import { ParentDto } from '../dto/parent.dto';

@Controller('parent-details')
export class UserDetailsController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async submitForm(@Body() userDetailsDto: ParentDto): Promise<User> {
    return this.usersService.create(userDetailsDto);
  }

  @Get()
  async getAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
