import { Controller, Post, Body, Get } from '@nestjs/common';
import { Teacher } from '../entities';
import { TeacherService } from '../services/teacher.service';
import { TeacherDto } from '../dto/teacher.dto';

@Controller('teacher')
export class TeacherDetailsController {
  constructor(private readonly usersService: TeacherService) {}

  @Post()
  async submitForm(@Body() userDetailsDto: TeacherDto): Promise<Teacher> {
    return this.usersService.create(userDetailsDto);
  }

  @Get()
  async getAll(): Promise<Teacher[]> {
    return this.usersService.findAll();
  }
}
