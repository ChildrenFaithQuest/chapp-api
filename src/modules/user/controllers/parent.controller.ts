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

@Controller()
export class ParentDetailsController {
  constructor(private readonly parentService: ParentService) {}

  @Get('parents')
  async getAll(): Promise<Parent[]> {
    return this.parentService.findAll();
  }

  @Get('parent/:id')
  async findOne(@Param('id') id: string): Promise<Parent | null> {
    return this.parentService.findOne(id);
  }

  @Put('parent/:id')
  update(@Param('id') id: string, @Body() updateParentDto: UpdateUserDto) {
    return this.parentService.update(id, updateParentDto);
  }

  @Patch('parent/:id')
  partialUpdate(
    @Param('id') id: string,
    @Body() partialData: Partial<UpdateUserDto>,
  ) {
    return this.parentService.partialUpdate(id, partialData);
  }

  @Delete('parent/:id')
  delete(@Param('id') id: string) {
    return this.parentService.delete(id);
  }
}
