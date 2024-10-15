import { Repository } from 'typeorm';
import { ParentService } from '../services/parent.service';
import { UserService } from '../services/user.service';
import { ParentDetailsController } from './parent.controller';
import { mockParents } from '@app-root/mocks/parent';
import { UserGender } from '@app-types/module.types';
import { Parent } from '../entities/parent.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateUserDto } from '../dtos/update-user.dto';

const mockParentRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

// Mock for UserService
const mockUserService = () => ({
  update: jest.fn(), // Mock any methods you are using
  partialUpdate: jest.fn(),
});

describe('ParentController', () => {
  let parentController: ParentDetailsController;
  let parentService: ParentService;
  let parentRepository: Repository<Parent>;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParentDetailsController],
      providers: [
        ParentService,
        {
          provide: getRepositoryToken(Parent),
          useValue: mockParentRepository(), // Mock repository
        },
        {
          provide: UserService,
          useValue: mockUserService(), // Use the mock user service
        },
      ],
    }).compile();

    parentController = module.get<ParentDetailsController>(
      ParentDetailsController,
    );
    parentService = module.get<ParentService>(ParentService);
    parentRepository = module.get<Repository<Parent>>(
      getRepositoryToken(Parent),
    );
    userService = module.get<UserService>(UserService);
  });

  describe('getAll', () => {
    it('should return an array of all parents', async () => {
      jest.spyOn(parentService, 'findAll').mockResolvedValue(mockParents);
      expect(await parentController.getAll()).toBe(mockParents);
    });
  });

  describe('find', () => {
    it('should return a parent', async () => {
      jest.spyOn(parentService, 'findOne').mockResolvedValue(mockParents[2]);
      expect(await parentController.findOne('parent_003')).toBe(mockParents[2]);
    });
  });

  describe('update', () => {
    it('should update a parent details', async () => {
      const id = 'parent_001';

      const updateParentDto: UpdateUserDto = {
        gender: UserGender.MALE,
        firstName: 'Johne',
        lastName: 'Doe',
        contact: {
          phoneNumber: '+1234567890',
          address: '788 Elm St, Springfield',
        },
        dateOfBirth: new Date(''),
      };

      const updatedParent = {
        id,
        ...updateParentDto,
      };
      // Mock repository methods
      userService.update = jest.fn().mockImplementation(() => updatedParent);

      const result = await parentController.update(id, updateParentDto);

      expect(result).toEqual(updatedParent);

      expect(userService.update).toHaveBeenCalledWith(
        id,
        updateParentDto,
        parentRepository,
      );
    });
  });

  describe('partialUpdate', () => {
    it('should partially update a parent', async () => {
      const id = 'parent_002';
      const partialUpdateParentDto: Partial<UpdateUserDto> = {
        gender: UserGender.MALE, // Only updating gender
      };

      const existingParent = {
        id,
        gender: UserGender.MALE,
        firstName: 'John',
        lastName: 'Doe',
        contact: {
          phoneNumber: '+1234567890',
          address: '788 Elm St, Springfield',
        },
        children: [],
        createdAt: new Date('2021-10-12T22:45:00Z'),
        updatedAt: new Date('2021-10-12T22:45:00Z'),
      };

      const updatedParent = {
        ...existingParent, // All fields from the existing parent
        gender: UserGender.MALE, // Only gender is updated
      };
      userService.partialUpdate = jest
        .fn()
        .mockImplementation(() => updatedParent);

      const result = await parentController.partialUpdate(
        id,
        partialUpdateParentDto,
      );

      expect(userService.partialUpdate).toHaveBeenCalledWith(
        id,
        partialUpdateParentDto,
        parentRepository,
      );
      expect(result).toStrictEqual(updatedParent);
    });
  });

  describe('delete', () => {
    it('should delete a parent', async () => {
      const id = 'parent_001';
      await parentController.delete(id);
      expect(parentRepository.delete).toHaveBeenCalledWith(id);
    });
  });
});
