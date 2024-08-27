import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, Repository } from 'typeorm';
import { Child } from '../entities/child.entity';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserService } from './user.service';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class ChildService {
  constructor(
    @InjectRepository(Child)
    private childRepository: Repository<Child>,
    private readonly userService: UserService,
  ) {}

  async create(
    childDetails: CreateUserDto,
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

  findOne(id: string): Promise<Child | null> {
    return this.childRepository.findOneBy({ id });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Child> {
    return this.userService.update(id, updateUserDto, this.childRepository);
  }

  async partialUpdate(
    id: string,
    partialData: DeepPartial<Child>,
  ): Promise<Child> {
    return this.userService.partialUpdate(
      id,
      partialData,
      this.childRepository,
    );
  }

  async remove(id: number): Promise<void> {
    await this.childRepository.delete(id);
  }
}
