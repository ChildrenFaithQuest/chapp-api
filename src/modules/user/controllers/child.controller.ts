import { Body, Controller, Get, Param, Patch, Put } from '@nestjs/common';
import { Child } from '../entities';
import { ChildService } from '../services/child.service';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('child')
export class ChildDetailsController {
  constructor(private readonly childService: ChildService) {}

  @Get()
  async getAll(): Promise<Child[]> {
    return this.childService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Child | null> {
    return this.childService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.childService.update(id, updateUserDto);
  }

  @Patch(':id')
  partialUpdate(@Param('id') id: string, @Body() partialData: UpdateUserDto) {
    return this.childService.partialUpdate(id, partialData);
  }
}
