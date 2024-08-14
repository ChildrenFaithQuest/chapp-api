import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from '../entities';
import { TeacherDto } from '../dto/teacher.dto';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private teachersRepository: Repository<Teacher>,
  ) {}

  async create(teacherDetailsDto: TeacherDto): Promise<Teacher> {
    const parentDetails = this.teachersRepository.create(teacherDetailsDto);
    return this.teachersRepository.save(parentDetails);
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
