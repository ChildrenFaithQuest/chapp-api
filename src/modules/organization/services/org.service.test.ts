import { Test, TestingModule } from '@nestjs/testing';
import { OrgService } from '../services/org.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Organization } from '../entities/organization.entity';
import { mockOrgArray } from '@app-root/mocks/organization';
import { UpdateOrgDto } from '../dtos/update-org.dto';
import { OrgType } from '@app-types/module.types';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('Org Service', () => {
  let orgService: OrgService;
  let orgRepository: Partial<Repository<Organization>>;
  beforeEach(async () => {
    orgRepository = {
      create: jest.fn(),
      find: jest.fn(), // Mocking the `find` method
      delete: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrgService,
        {
          provide: getRepositoryToken(Organization),
          useValue: orgRepository, // Mock repository
        },
      ],
    }).compile();

    orgService = module.get<OrgService>(OrgService);
  });

  it('should create an organization', async () => {
    const testOrg = {
      name: 'Grace Community Church',
      address: '123 Main St, Springfield',
      type: OrgType.CHURCH,
      description: 'A vibrant community of believers.',
    };
    orgRepository.create = jest.fn().mockImplementation(() => mockOrgArray[1]);
    orgRepository.save = jest.fn().mockImplementation(() => mockOrgArray[1]);

    const result = await orgService.create(testOrg);

    expect(orgRepository.create).toHaveBeenCalledWith(testOrg);
    expect(orgRepository.save).toHaveBeenCalledWith(mockOrgArray[1]);
    expect(result).toBe(mockOrgArray[1]);
  });

  it('should findAll organizations', async () => {
    orgRepository.find = jest.fn().mockImplementation(() => mockOrgArray);
    const result = await orgService.findAll();
    expect(orgRepository.find).toHaveBeenCalled();
    expect(result).toBe(mockOrgArray);
  });

  it('should findOne organization', async () => {
    const id = 'testId';
    orgRepository.findOne = jest.fn().mockImplementation(() => mockOrgArray[0]);

    const result = await orgService.findOne(id);
    expect(orgRepository.findOne).toHaveBeenCalledTimes(1);
    expect(orgRepository.findOne).toHaveBeenCalledWith({ where: { id } });

    expect(result).toBe(mockOrgArray[0]);
  });

  it('should throw expection if organization is not found', async () => {
    orgRepository.findOne = jest.fn().mockImplementation(() => null);

    const id = 'testId';
    await expect(orgService.findOne(id)).rejects.toThrow(
      new NotFoundException(`Organization with id ${id} not found`),
    );
  });

  it('should update organization details', async () => {
    const id = 'testId';
    const updateOrgDto: UpdateOrgDto = {
      name: 'test',
    };

    orgRepository.findOne = jest.fn().mockImplementation(() => mockOrgArray[0]);
    (orgRepository.update as jest.Mock).mockResolvedValue(mockOrgArray[0]);
    const result = await orgService.update(id, updateOrgDto);
    expect(orgRepository.findOne).toHaveBeenCalled();
    expect(orgRepository.update).toHaveBeenCalledWith(id, updateOrgDto);
    expect(result).toBe(mockOrgArray[0]);
  });

  it('should not update a non existence organization details', async () => {
    const id = 'testId';
    const updateOrgDto: UpdateOrgDto = {
      name: 'test',
    };
    orgRepository.findOne = jest.fn().mockImplementation(() => null);
    await expect(orgService.update(id, updateOrgDto)).rejects.toThrow(
      new NotFoundException(`Organization with id ${id} not found`),
    );
  });

  it('should delete an organization ', async () => {
    const id = 'testId';
    orgRepository.findOne = jest.fn().mockImplementation(() => mockOrgArray[0]);

    await orgService.delete(id);
    expect(orgRepository.remove).toHaveBeenCalledWith(mockOrgArray[0]);
  });
});
