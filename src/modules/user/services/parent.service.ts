import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parent } from '../entities';
import { encryptPassword } from '@app-shared/helpers/encrypt';
import { ParentDto } from '../dto/parent.dto';

@Injectable()
export class ParentService {
  constructor(
    @InjectRepository(Parent)
    private parentsRepository: Repository<Parent>,
  ) {}

  async create(parentDetails: ParentDto): Promise<Parent> {
    const hashedPassword = await encryptPassword(parentDetails.password);
    const parent = this.parentsRepository.create({
      ...parentDetails,
      password: hashedPassword,
    });
    return this.parentsRepository.save(parent);
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
