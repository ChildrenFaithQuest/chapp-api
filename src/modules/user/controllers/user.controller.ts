import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
} from '@nestjs/common';
import { ParentService } from '../services/parent.service';
import { Parent } from '../entities';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserType } from '@app-types/module.types';

@Controller('users')
export class UsersController {
  constructor(
    private readonly parentService: ParentService,
    private readonly teacherService: ParentService,
    private readonly childService: ParentService,
  ) {}

  @Get()
  async getAll(): Promise<Parent[]> {
    const parents = await this.parentService.findAll();
    const teachers = await this.teacherService.findAll();
    const children = await this.childService.findAll();

    return [...parents, ...teachers, ...children];
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Param('userType') userType: UserType,
  ): Promise<Parent | null> {
    switch (userType) {
      case 'parent':
        return this.parentService.findOne(id);
      case 'teacher':
        return this.teacherService.findOne(id);
      case 'child':
        return this.childService.findOne(id);
      default:
        throw new BadRequestException('Invalid user type');
    }
  }

  @Put(':userType/:id')
  async update(
    @Param('id') id: string,
    @Param('userType') userType: UserType,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    switch (userType) {
      case 'parent':
        return this.parentService.update(id, updateUserDto);
      case 'teacher':
        return this.teacherService.update(id, updateUserDto);
      case 'child':
        return this.childService.update(id, updateUserDto);
      default:
        throw new BadRequestException('Invalid user type');
    }
  }

  @Patch(':userType/:id')
  async partialUpdate(
    @Param('id') id: string,
    @Param('userType') userType: UserType,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    switch (userType) {
      case 'parent':
        return this.parentService.update(id, updateUserDto);
      case 'teacher':
        return this.teacherService.update(id, updateUserDto);
      case 'child':
        return this.childService.update(id, updateUserDto);
      default:
        throw new BadRequestException('Invalid user type');
    }
  }
}
