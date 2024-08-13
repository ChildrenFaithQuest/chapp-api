import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parent } from '../entities';
import { ParentDto } from '../dto/parent.dto';

@Injectable()
export class ParentsService {
  constructor(
    @InjectRepository(Parent)
    private parentsRepository: Repository<Parent>,
  ) {}

  async create(parentDetailsDto: ParentDto): Promise<Parent> {
    const parentDetails = this.parentsRepository.create(parentDetailsDto);
    return this.parentsRepository.save(parentDetails);
  }

  findAll(): Promise<Parent[]> {
    return this.parentsRepository.find();
  }

  findOne(id: number): Promise<Parent | null> {
    return this.parentsRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.parentsRepository.delete(id);
  }
}
