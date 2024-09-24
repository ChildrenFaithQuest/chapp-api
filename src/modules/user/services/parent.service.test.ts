import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { UserGender } from '@app-types/module.types';
import { mockParentData, mockParents } from '@app-root/mocks/parent';

import { Parent } from '../entities/parent.entity';
import { UserService } from './user.service';
import { ParentService } from './parent.service';
import { UpdateUserDto } from '../dtos/update-user.dto';

describe('Parent Service', () => {
  let parentService: ParentService;
  let mockParentRepository: Partial<Repository<Parent>>;

  let mockTransactionalEntityManager: {
    create: jest.Mock;
    save: jest.Mock;
  };

  let mockUserService: Partial<UserService>;

  beforeEach(async () => {
    mockUserService = {
      update: jest.fn(),
      partialUpdate: jest.fn(),
    };

    mockParentRepository = {
      find: jest.fn(), // Mocking the `find` method
      findOneBy: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParentService,
        {
          provide: getRepositoryToken(Parent),
          useValue: mockParentRepository, // Mock repository
        },
        {
          provide: UserService,
          useValue: mockUserService, // Use the mock user service
        },
      ],
    }).compile();

    mockTransactionalEntityManager = {
      create: jest.fn(),
      save: jest.fn(),
    };

    // Mocking the transactionalEntityManager methods
    mockTransactionalEntityManager.create!.mockReturnValue(mockParents[0]);
    mockTransactionalEntityManager.save!.mockResolvedValue(mockParents[0]);

    parentService = module.get<ParentService>(ParentService);
  });
  it('should create a parent', async () => {
    const result = await parentService.create(
      mockParentData,
      mockTransactionalEntityManager as unknown as EntityManager,
    );

    expect(mockTransactionalEntityManager.create).toHaveBeenCalledWith(
      Parent,
      mockParentData,
    );
    expect(mockTransactionalEntityManager.save).toHaveBeenCalledWith(
      Parent,
      mockParents[0],
    );
    expect(result).toEqual(mockParents[0]);
  });
  it('should findAll parents', async () => {
    (mockParentRepository.find as jest.Mock).mockReturnValue(mockParents);
    const result = await parentService.findAll();
    expect(mockParentRepository.find).toHaveBeenCalled();
    expect(result).toBe(mockParents);
  });

  it('should findOne parent', async () => {
    (mockParentRepository.findOneBy as jest.Mock).mockReturnValue(
      mockParents[0],
    );
    const result = await parentService.findOne('parent_001');
    expect(mockParentRepository.findOneBy).toHaveBeenCalled();
    expect(result).toBe(mockParents[0]);
  });

  it('should throw expection if parent is not found', async () => {
    (mockParentRepository.findOneBy as jest.Mock).mockResolvedValue(null);
    const id = 'parent_001';
    await expect(parentService.findOne(id)).rejects.toThrow(
      new NotFoundException(`Parent with ID ${id} not found`),
    );
  });

  it('should update parent details', async () => {
    const id = 'parent_001';
    const updatedParent: UpdateUserDto = {
      gender: UserGender.FEMALE,
      firstName: '',
      lastName: '',
      dateOfBirth: new Date(),
      contact: {
        address: 'new updated address',
        phoneNumber: '+2336550977',
      },
    };
    (mockUserService.update as jest.Mock).mockResolvedValue(updatedParent);
    const result = await parentService.update(id, updatedParent);
    expect(mockUserService.update).toHaveBeenCalled();
    expect(mockUserService.update).toHaveBeenCalledWith(
      id,
      updatedParent,
      mockParentRepository,
    );

    expect(result).toBe(updatedParent);
  });

  it('should partially update parent details', async () => {
    const id = 'parent_001';
    const updatedParent: Partial<UpdateUserDto> = {
      gender: UserGender.FEMALE,
      firstName: 'Robert',
    };
    (mockUserService.partialUpdate as jest.Mock).mockResolvedValue(
      updatedParent,
    );
    const result = await parentService.partialUpdate(id, updatedParent);
    expect(mockUserService.partialUpdate).toHaveBeenCalled();
    expect(mockUserService.partialUpdate).toHaveBeenCalledWith(
      id,
      updatedParent,
      mockParentRepository,
    );
    expect(result).toBe(updatedParent);
  });

  it('should delete a parent record ', async () => {
    const id = 'parent_001';
    await parentService.delete(id);
    expect(mockParentRepository.delete).toHaveBeenCalledWith(id);
  });
});
