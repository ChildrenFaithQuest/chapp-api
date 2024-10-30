import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ParentService } from '../services/parent.service';
import { Parent } from '../entities/parent.entity';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { TeacherService } from '../services/teacher.service';
import { ChildService } from '../services/child.service';
import { Teacher } from '../entities/teacher.entity';
import { Child } from '../entities/child.entity';
import { UpdateChildDto } from '../dtos/update-child.dto';
import { Permission, RoleType } from '@app-types/role.types';
import { RoleGuard } from '@app-shared/guards/role.guard';
import { AuthService } from '@app-modules/auth/services/auth.service';
import { Permissions, Roles } from '@app-shared/guards/role.decorator';

export type User = Parent | Teacher | Child;

@Controller('users')
@UseGuards(RoleGuard)
export class UsersController {
  constructor(
    private readonly parentService: ParentService,
    private readonly teacherService: TeacherService,
    private readonly childService: ChildService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @SetMetadata('roles', [RoleType.ADMIN])
  @Roles(RoleType.ADMIN)
  @Permissions(Permission.MANAGE_USERS)
  async getAll(): Promise<User[]> {
    const teachers = await this.teacherService.findAll();
    const parents = await this.parentService.findAll();
    const children = await this.childService.findAll();
    return [...parents, ...teachers, ...children];
  }

  @Get(':id')
  @SetMetadata('roles', [RoleType.TEACHER, RoleType.CHILD, RoleType.PARENT])
  @SetMetadata('permissions', [
    Permission.VIEW_SELF,
    Permission.VIEW_ASSIGNED_CHILDREN,
    Permission.VIEW_OWN_CHILD,
  ])
  async findOne(@Param('id') id: string): Promise<User | null> {
    const userType = await this.authService.getUserType(id);
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

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto | UpdateChildDto,
  ) {
    const userType = await this.authService.getUserType(id);
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

  @Patch(':id')
  async partialUpdate(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<UpdateUserDto | UpdateChildDto>,
  ) {
    const userType = await this.authService.getUserType(id);
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
