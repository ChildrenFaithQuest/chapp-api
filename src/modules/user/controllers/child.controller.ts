import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserDto } from '../dto/user.dto';
import { Child } from '../entities';
import { ChildService } from '../services/child.service';

@Controller('child')
export class ChildDetailsController {
  constructor(private readonly usersService: ChildService) {}

  @Post()
  async submitForm(@Body() userDetailsDto: UserDto): Promise<Child> {
    return this.usersService.create(userDetailsDto);
  }

  @Get()
  async getAll(): Promise<Child[]> {
    return this.usersService.findAll();
  }
}
