import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Child } from '../entities';
import { UserBaseDto } from '../dto/user-base';

@Injectable()
export class ChildService {
  constructor(
    @InjectRepository(Child)
    private childRepository: Repository<Child>,
  ) {}

  async create(
    childDetails: UserBaseDto,
    transactionalEntityManager: EntityManager,
  ): Promise<Child> {
    const parent = transactionalEntityManager.create(Child, {
      ...childDetails,
    });
    return transactionalEntityManager.save(Child, parent);
  }

  findAll(): Promise<Child[]> {
    return this.childRepository.find();
  }

  findOne(id: number): Promise<Child | null> {
    return this.childRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.childRepository.delete(id);
  }
}
