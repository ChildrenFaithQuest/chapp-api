import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Child } from '../entities/child.entity';
import { UserService } from './user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateChildDto } from '../dtos/update-child.dto';

@Injectable()
export class ChildService {
  constructor(
    @InjectRepository(Child)
    private childRepository: Repository<Child>,
    private readonly userService: UserService,
  ) {}

  async create(childDetails: CreateUserDto): Promise<Child> {
    const child = this.childRepository.create({
      ...childDetails,
    });
    return await this.childRepository.save(child);
  }

  findAll(): Promise<Child[]> {
    return this.childRepository.find();
  }

  async findOne(id: string): Promise<Child | null> {
    const child = await this.childRepository.findOneBy({ id });
    if (!child) {
      throw new NotFoundException(`Child with ID ${id} not found`);
    }
    return child;
  }

  async update(id: string, updateChildDto: UpdateChildDto): Promise<Child> {
    return this.userService.update(id, updateChildDto, this.childRepository);
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

  async delete(id: string): Promise<void> {
    await this.childRepository.delete(id);
  }
}
