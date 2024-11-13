import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
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

  async create(parentDetails: CreateUserDto): Promise<Parent> {
    const parent = this.parentsRepository.create(parentDetails);
    return await this.parentsRepository.save(parent);
  }

  findAll(): Promise<Parent[]> {
    return this.parentsRepository.find();
  }

  async findOne(id: string): Promise<Parent | null> {
    const parent = await this.parentsRepository.findOneBy({ id });
    if (!parent) {
      throw new NotFoundException(`Parent with ID ${id} not found`);
    }
    return parent;
  }

  async update(id: string, updateParentDto: UpdateUserDto): Promise<Parent> {
    return this.userService.update(id, updateParentDto, this.parentsRepository);
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

  async delete(id: string): Promise<void> {
    await this.parentsRepository.delete(id);
  }
}
