import { Controller, Post, Body, Get } from '@nestjs/common';
import { ParentService } from '../services/parent.service';
import { Parent } from '../entities';
import { ParentDto } from '../dto/parent.dto';

@Controller('parent')
export class ParentDetailsController {
  constructor(private readonly usersService: ParentService) {}

  @Post()
  async submitForm(@Body() userDetailsDto: ParentDto): Promise<Parent> {
    return this.usersService.create(userDetailsDto);
  }

  @Get()
  async getAll(): Promise<Parent[]> {
    return this.usersService.findAll();
  }
}
