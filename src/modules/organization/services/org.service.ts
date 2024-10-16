import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { CreateOrgDto } from '../dtos/create-org.dto';
import { UpdateOrgDto } from '../dtos/update-org.dto';

@Injectable()
export class OrgService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepository: Repository<Organization>,
  ) {}

  async create(createOrgDto: CreateOrgDto): Promise<Organization> {
    const org = this.orgRepository.create(createOrgDto);
    return await this.orgRepository.save(org);
  }

  async findAll(): Promise<Organization[]> {
    return await this.orgRepository.find();
  }

  async findOne(id: string): Promise<Organization> {
    const organization = await this.orgRepository.findOne({
      where: { id },
    });
    if (!organization) {
      throw new NotFoundException(`Organization with id ${id} not found`);
    }
    return organization;
  }

  async update(id: string, updateOrgDto: UpdateOrgDto): Promise<Organization> {
    try {
      await this.findOne(id); // Ensure the organization exists
      await this.orgRepository.update(id, updateOrgDto);
      return this.findOne(id); // Return the updated organization
    } catch (error) {
      throw new NotFoundException(`Organization with id ${id} not found`);
    }
  }

  async delete(id: string): Promise<void> {
    const organization = await this.findOne(id);
    if (!organization) {
      throw new NotFoundException(`Organization with id ${id} not found`);
    }
    await this.orgRepository.remove(organization);
  }
}
