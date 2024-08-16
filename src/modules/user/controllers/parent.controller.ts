import { Body, Controller, Get, Param, Patch, Put } from '@nestjs/common';
import { ParentService } from '../services/parent.service';
import { Parent } from '../entities';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('parents')
export class ParentDetailsController {
  constructor(private readonly parentService: ParentService) {}

  @Get()
  async getAll(): Promise<Parent[]> {
    return this.parentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Parent | null> {
    return this.parentService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTeacherDto: UpdateUserDto) {
    return this.parentService.update(id, updateTeacherDto);
  }

  @Patch(':id')
  partialUpdate(@Param('id') id: string, @Body() partialData: UpdateUserDto) {
    return this.parentService.partialUpdate(id, partialData);
  }
}
