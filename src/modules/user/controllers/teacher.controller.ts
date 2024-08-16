import { Body, Controller, Get, Param, Patch, Put } from '@nestjs/common';
import { Teacher } from '../entities';
import { TeacherService } from '../services/teacher.service';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('teachers')
export class TeacherDetailsController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get()
  async getAll(): Promise<Teacher[]> {
    return this.teacherService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Teacher | null> {
    return this.teacherService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTeacherDto: UpdateUserDto) {
    return this.teacherService.update(id, updateTeacherDto);
  }

  @Patch(':id')
  partialUpdate(@Param('id') id: string, @Body() partialData: UpdateUserDto) {
    return this.teacherService.partialUpdate(id, partialData);
  }
}
