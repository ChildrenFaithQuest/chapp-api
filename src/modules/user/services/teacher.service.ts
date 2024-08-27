import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, Repository } from 'typeorm';
import { Teacher } from '../entities/teacher.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from './user.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    private readonly userService: UserService,
  ) {}

  async create(
    parentDetails: CreateUserDto,
    transactionalEntityManager: EntityManager,
  ): Promise<Teacher> {
    const parent = transactionalEntityManager.create(Teacher, {
      ...parentDetails,
    });
    return transactionalEntityManager.save(Teacher, parent);
  }

  findAll(): Promise<Teacher[]> {
    return this.teacherRepository.find();
  }

  findOne(id: string): Promise<Teacher | null> {
    return this.teacherRepository.findOneBy({ id });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Teacher> {
    return this.userService.update(id, updateUserDto, this.teacherRepository);
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

  async remove(id: string): Promise<void> {
    await this.teacherRepository.delete(id);
  }
}
