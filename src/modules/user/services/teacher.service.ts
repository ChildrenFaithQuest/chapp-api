import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Teacher } from '../entities/teacher.entity';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserService } from './user.service';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    private readonly userService: UserService,
  ) {}

  async create(teacherDetails: CreateUserDto): Promise<Teacher> {
    const teacher = this.teacherRepository.create(teacherDetails);
    return await this.teacherRepository.save(teacher);
  }

  findAll(): Promise<Teacher[]> {
    return this.teacherRepository.find();
  }

  async findOne(id: string): Promise<Teacher | null> {
    const teacher = await this.teacherRepository.findOneBy({ id });
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
    return teacher;
  }

  async update(id: string, updateTeacherDto: UpdateUserDto): Promise<Teacher> {
    return this.userService.update(
      id,
      updateTeacherDto,
      this.teacherRepository,
    );
  }

  async partialUpdate(
    id: string,
    updateUserDto: DeepPartial<Teacher>,
  ): Promise<Teacher> {
    return this.userService.partialUpdate(
      id,
      updateUserDto,
      this.teacherRepository,
    );
  }

  async delete(id: string): Promise<void> {
    await this.teacherRepository.delete(id);
  }
}
