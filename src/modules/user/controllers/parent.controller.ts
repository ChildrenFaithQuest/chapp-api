import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
} from '@nestjs/common';
import { ParentService } from '../services/parent.service';
import { Parent } from '../entities/parent.entity';
import { UpdateUserDto } from '../dtos/update-user.dto';

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
  update(@Param('id') id: string, @Body() updateParentDto: UpdateUserDto) {
    return this.parentService.update(id, updateParentDto);
  }

  @Patch(':id')
  partialUpdate(
    @Param('id') id: string,
    @Body() partialData: Partial<UpdateUserDto>,
  ) {
    return this.parentService.partialUpdate(id, partialData);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.parentService.delete(id);
  }
}
