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
  partialUpdate(
    @Param('id') id: string,
    @Body() partialData: Partial<UpdateUserDto>,
  ) {
    return this.teacherService.partialUpdate(id, partialData);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.teacherService.delete(id);
  }
}
