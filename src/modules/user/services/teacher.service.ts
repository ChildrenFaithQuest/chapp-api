import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Teacher } from '../entities';
import { CreateTeacherDto } from '../dto/create-teacher.dto';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private teachersRepository: Repository<Teacher>,
  ) {}

  async create(
    parentDetails: CreateTeacherDto,
    transactionalEntityManager: EntityManager,
  ): Promise<Teacher> {
    const parent = transactionalEntityManager.create(Teacher, {
      ...parentDetails,
    });
    return transactionalEntityManager.save(Teacher, parent);
  }

  findAll(): Promise<Teacher[]> {
    return this.teachersRepository.find();
  }

  findOne(id: number): Promise<Teacher | null> {
    return this.teachersRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.teachersRepository.delete(id);
  }
}
