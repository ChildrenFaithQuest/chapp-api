import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, Repository } from 'typeorm';
import { Parent } from '../entities/parent.entity';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserService } from './user.service';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class ParentService {
  constructor(
    @InjectRepository(Parent)
    private parentsRepository: Repository<Parent>,
    private readonly userService: UserService,
  ) {}

  async create(
    parentDetails: CreateUserDto,
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

  findOne(id: string): Promise<Parent | null> {
    return this.parentsRepository.findOneBy({ id });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Parent> {
    return this.userService.update(id, updateUserDto, this.parentsRepository);
  }

  async partialUpdate(
    id: string,
    partialData: DeepPartial<Parent>,
  ): Promise<Parent> {
    return this.userService.partialUpdate(
      id,
      partialData,
      this.parentsRepository,
    );
  }

  async remove(id: string): Promise<void> {
    await this.parentsRepository.delete(id);
  }
}
