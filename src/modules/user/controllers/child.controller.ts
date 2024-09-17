import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
} from '@nestjs/common';
import { Child } from '../entities/child.entity';
import { ChildService } from '../services/child.service';
import { UpdateChildDto } from '../dtos/update-child.dto';

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
  update(@Param('id') id: string, @Body() updateChildDto: UpdateChildDto) {
    return this.childService.update(id, updateChildDto);
  }

  @Patch(':id')
  partialUpdate(
    @Param('id') id: string,
    @Body() partialData: Partial<UpdateChildDto>,
  ) {
    return this.childService.partialUpdate(id, partialData);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.childService.delete(id);
  }
}
