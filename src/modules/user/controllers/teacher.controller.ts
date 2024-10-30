import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
} from '@nestjs/common';
import { Teacher } from '../entities/teacher.entity';
import { TeacherService } from '../services/teacher.service';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Controller()
export class TeacherDetailsController {
  constructor(private readonly teacherService: TeacherService) {}

  @Get('teachers')
  async getAll(): Promise<Teacher[]> {
    return this.teacherService.findAll();
  }

  @Get('teacher/:id')
  async findOne(@Param('id') id: string): Promise<Teacher | null> {
    return this.teacherService.findOne(id);
  }

  @Put('teacher/:id')
  update(@Param('id') id: string, @Body() updateTeacherDto: UpdateUserDto) {
    return this.teacherService.update(id, updateTeacherDto);
  }

  @Patch('teacher/:id')
  partialUpdate(
    @Param('id') id: string,
    @Body() partialData: Partial<UpdateUserDto>,
  ) {
    return this.teacherService.partialUpdate(id, partialData);
  }

  @Delete('teacher/:id')
  delete(@Param('id') id: string) {
    return this.teacherService.delete(id);
  }
}
