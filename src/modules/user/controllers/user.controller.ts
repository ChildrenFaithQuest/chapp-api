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
import { Parent } from '../entities/parent.entity';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserType } from '@app-types/module.types';
import { TeacherService } from '../services/teacher.service';
import { ChildService } from '../services/child.service';
import { Teacher } from '../entities/teacher.entity';
import { Child } from '../entities/child.entity';
import { UpdateChildDto } from '../dtos/update-child.dto';

export type User = Parent | Teacher | Child;

@Controller('users')
export class UsersController {
  constructor(
    private readonly parentService: ParentService,
    private readonly teacherService: TeacherService,
    private readonly childService: ChildService,
  ) {}

  @Get()
  async getAll(): Promise<User[]> {
    const teachers = await this.teacherService.findAll();
    const parents = await this.parentService.findAll();
    const children = await this.childService.findAll();
    return [...parents, ...teachers, ...children];
  }

  @Get(':userType/:id')
  async findOne(
    @Param('id') id: string,
    @Param('userType') userType: UserType,
  ): Promise<User | null> {
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
    @Body() updateUserDto: UpdateUserDto | UpdateChildDto,
  ) {
    switch (userType) {
      case 'parent':
        return this.parentService.update(id, updateUserDto as UpdateUserDto);
      case 'teacher':
        return this.teacherService.update(id, updateUserDto as UpdateUserDto);
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
    @Body() updateUserDto: Partial<UpdateUserDto | UpdateChildDto>,
  ) {
    switch (userType) {
      case 'parent':
        return this.parentService.partialUpdate(
          id,
          updateUserDto as UpdateUserDto,
        );
      case 'teacher':
        return this.teacherService.partialUpdate(
          id,
          updateUserDto as UpdateUserDto,
        );
      case 'child':
        return this.childService.partialUpdate(
          id,
          updateUserDto as UpdateChildDto,
        );
      default:
        throw new BadRequestException('Invalid user type');
    }
  }
}
