import { Controller, Get } from '@nestjs/common';
import { Teacher } from '../entities';
import { TeacherService } from '../services/teacher.service';

@Controller('teacher')
export class TeacherDetailsController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get()
  async getAll(): Promise<Teacher[]> {
    return this.teacherService.findAll();
  }
}
