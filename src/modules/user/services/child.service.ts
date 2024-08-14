import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Child } from '../entities';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class ChildService {
  constructor(
    @InjectRepository(Child)
    private childRepository: Repository<Child>,
  ) {}

  async create(childDetailsDto: UserDto): Promise<Child> {
    const parentDetails = this.childRepository.create(childDetailsDto);
    return this.childRepository.save(parentDetails);
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
