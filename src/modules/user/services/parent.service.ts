import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Parent } from '../entities';
import { ParentDetailsDto } from '../dto/parent-details.dto';

@Injectable()
export class ParentService {
  constructor(
    @InjectRepository(Parent)
    private parentsRepository: Repository<Parent>,
  ) {}

  async create(
    parentDetails: ParentDetailsDto,
    transactionalEntityManager: EntityManager,
  ): Promise<Parent> {
    const parent = transactionalEntityManager.create(Parent, {
      ...parentDetails,
    });
    return transactionalEntityManager.save(Parent, parent);
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
