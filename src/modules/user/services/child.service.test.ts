import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ChildService } from './child.service';
import { Child } from '../entities/child.entity';
import { mockChildData, mockChildren } from '@app-root/mocks/child';
import { UserService } from './user.service';
import { UserGender } from '@app-types/module.types';
import { UpdateChildDto } from '../dtos/update-child.dto';

describe('Child Service', () => {
  let childService: ChildService;
  let mockChildRepository: Partial<Repository<Child>>;

  let mockUserService: Partial<UserService>;

  beforeEach(async () => {
    mockUserService = {
      update: jest.fn(),
      partialUpdate: jest.fn(),
    };

    mockChildRepository = {
      find: jest.fn(), // Mocking the `find` method
      findOneBy: jest.fn(),
      delete: jest.fn(),
      create: jest.fn().mockReturnValue(mockChildren[0]),
      save: jest.fn().mockReturnValue(mockChildren[0]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChildService,
        {
          provide: getRepositoryToken(Child),
          useValue: mockChildRepository, // Mock repository
        },
        {
          provide: UserService,
          useValue: mockUserService, // Use the mock user service
        },
      ],
    }).compile();

    childService = module.get<ChildService>(ChildService);
  });
  it('should create a child', async () => {
    const result = await childService.create(mockChildData);

    expect(mockChildRepository.create).toHaveBeenCalledTimes(1);
    expect(mockChildRepository.save).toHaveBeenCalledWith(result);
    expect(result).toEqual(mockChildren[0]);
  });

  it('should findAll children', async () => {
    (mockChildRepository.find as jest.Mock).mockReturnValue(mockChildren);
    const result = await childService.findAll();
    expect(mockChildRepository.find).toHaveBeenCalled();
    expect(result).toBe(mockChildren);
  });

  it('should findOne child', async () => {
    const id = 'child_001';
    (mockChildRepository.findOneBy as jest.Mock).mockReturnValue(
      mockChildren[0],
    );
    const result = await childService.findOne(id);
    expect(mockChildRepository.findOneBy).toHaveBeenCalledTimes(1);
    expect(mockChildRepository.findOneBy).toHaveBeenCalledWith({ id });

    expect(result).toBe(mockChildren[0]);
  });

  it('should throw expection if child is not found', async () => {
    (mockChildRepository.findOneBy as jest.Mock).mockResolvedValue(null);
    const id = 'child_001';
    await expect(childService.findOne(id)).rejects.toThrow(
      new NotFoundException(`Child with ID ${id} not found`),
    );
  });

  it('should update child details', async () => {
    const id = 'child_001';
    const updatedChild: UpdateChildDto = {
      gender: UserGender.FEMALE,
      firstName: '',
      lastName: '',
      dateOfBirth: new Date(),
    };
    (mockUserService.update as jest.Mock).mockResolvedValue(updatedChild);
    const result = await childService.update(id, updatedChild);
    expect(mockUserService.update).toHaveBeenCalled();
    expect(mockUserService.update).toHaveBeenCalledWith(
      id,
      updatedChild,
      mockChildRepository,
    );

    expect(result).toBe(updatedChild);
  });

  it('should partially update child details', async () => {
    const id = 'child_001';
    const updatedChild: Partial<UpdateChildDto> = {
      gender: UserGender.FEMALE,
      firstName: 'Robert',
    };
    (mockUserService.partialUpdate as jest.Mock).mockResolvedValue(
      updatedChild,
    );
    const result = await childService.partialUpdate(id, updatedChild);
    expect(mockUserService.partialUpdate).toHaveBeenCalled();
    expect(mockUserService.partialUpdate).toHaveBeenCalledWith(
      id,
      updatedChild,
      mockChildRepository,
    );
    expect(result).toBe(updatedChild);
  });

  it('should delete a child record ', async () => {
    const id = 'child_001';
    await childService.delete(id);
    expect(mockChildRepository.delete).toHaveBeenCalledWith(id);
  });
});
