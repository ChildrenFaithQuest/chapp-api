import { Repository } from 'typeorm';
import { Child } from '../entities/child.entity';
import { ChildService } from '../services/child.service';
import { UserService } from '../services/user.service';
import { ChildDetailsController } from './child.controller';
import { mockChildren } from '@app-root/mocks/child';
import { mockClass } from '@app-root/mocks/class';
import { UserGender } from '@app-types/module.types';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateChildDto } from '../dtos/update-child.dto';

const mockChildRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

// Mock for UserService
const mockUserService = () => ({
  update: jest.fn(), // Mock any methods you are using
  partialUpdate: jest.fn(),
});

describe('ChildController', () => {
  let childController: ChildDetailsController;
  let childService: ChildService;
  let userService: UserService;
  let childRepository: Repository<Child>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChildDetailsController],
      providers: [
        ChildService,
        {
          provide: getRepositoryToken(Child),
          useValue: mockChildRepository(), // Mock repository
        },
        {
          provide: UserService,
          useValue: mockUserService(), // Use the mock user service
        },
      ],
    }).compile();

    childController = module.get<ChildDetailsController>(
      ChildDetailsController,
    );
    childService = module.get<ChildService>(ChildService);
    childRepository = module.get<Repository<Child>>(getRepositoryToken(Child));
    userService = module.get<UserService>(UserService);
    childService = new ChildService(childRepository, userService);
    childController = new ChildDetailsController(childService);
  });

  describe('getAll', () => {
    it('should return an array of all children', async () => {
      jest.spyOn(childService, 'findAll').mockResolvedValue(mockChildren);
      expect(await childController.getAll()).toBe(mockChildren);
    });
  });

  describe('find', () => {
    it('should return a child', async () => {
      jest.spyOn(childService, 'findOne').mockResolvedValue(mockChildren[2]);
      expect(await childController.findOne('child_003')).toBe(mockChildren[2]);
    });
  });

  describe('update', () => {
    it('should update a child record', async () => {
      const id = 'child_001';
      const updateChildDto: UpdateChildDto = {
        gender: UserGender.FEMALE,
        firstName: 'Sophia',
        lastName: 'Johnson',
        dateOfBirth: new Date(),
      };
      const updatedChild = {
        id,
        ...updateChildDto,
      };

      userService.update = jest.fn().mockImplementation(() => updatedChild);

      const result = await childController.update(id, updateChildDto);

      expect(result).toEqual(updatedChild);

      expect(userService.update).toHaveBeenCalledWith(
        id,
        updateChildDto,
        childRepository,
      );
    });
  });

  describe('partialUpdate', () => {
    it('should partially update a child', async () => {
      const id = 'child_001';
      const partialUpdateChildDto: Partial<UpdateChildDto> = {
        gender: UserGender.MALE, // Only updating gender
      };

      const existingChild = {
        id,
        gender: UserGender.FEMALE,
        firstName: 'Sophia',
        lastName: 'Johnson',
        class: mockClass.FAITHFULNESS,
        createdAt: new Date('2021-10-12T22:45:00Z'),
        updatedAt: new Date('2021-10-12T22:45:00Z'),
      };

      const updatedChild = {
        ...existingChild, // All fields from the existing parent
        gender: UserGender.MALE, // Only gender is updated
      };
      userService.partialUpdate = jest
        .fn()
        .mockImplementation(() => updatedChild);

      const result = await childController.partialUpdate(
        id,
        partialUpdateChildDto,
      );

      expect(userService.partialUpdate).toHaveBeenCalledWith(
        id,
        partialUpdateChildDto,
        childRepository,
      );
      expect(result).toStrictEqual(updatedChild);
    });
  });

  describe('delete', () => {
    it('should delete a child', async () => {
      const id = 'child_001';
      await childController.delete(id);
      expect(childRepository.delete).toHaveBeenCalledWith(id);
    });
  });
});
