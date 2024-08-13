import { Controller, Post, Body, Get } from '@nestjs/common';
import { ParentsService } from '../services/parent.service';
import { Parent } from '../entities';
import { ParentDto } from '../dto/parent.dto';

@Controller('parent-details')
export class UserDetailsController {
  constructor(private readonly usersService: ParentsService) {}

  @Post()
  async submitForm(@Body() userDetailsDto: ParentDto): Promise<Parent> {
    return this.usersService.create(userDetailsDto);
  }

  @Get()
  async getAll(): Promise<Parent[]> {
    return this.usersService.findAll();
  }
}
