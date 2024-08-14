import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parent } from '../entities';
import { ParentDto } from '../dto/parent.dto';
import { PasswordService } from '@app-shared/services/password-service';

@Injectable()
export class ParentService {
  constructor(
    @InjectRepository(Parent)
    private parentsRepository: Repository<Parent>,
    private passwordService: PasswordService,
  ) {}

  async create(parentDetails: ParentDto): Promise<Parent> {
    const hashedPassword = await this.passwordService.hashPassword(
      parentDetails.password,
    );
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
