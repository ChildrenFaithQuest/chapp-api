import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { UserGender } from '@app-types/module.types';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { Teacher } from '../entities/teacher.entity';
import { mockTeachers } from '@app-root/mocks/teacher';
import { NotFoundException } from '@nestjs/common';
import { mock } from 'jest-mock-extended';

describe('User Service', () => {
  let userService: UserService;
  let mockRepository: jest.Mocked<Repository<Teacher>>;

  beforeEach(async () => {
    mockRepository = mock<Repository<Teacher>>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(Teacher),
          useValue: mockRepository, // Mock repository
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
  });

  describe('update', () => {
    it('should update user details', async () => {
      (mockRepository.findOne as jest.Mock).mockResolvedValue(mockTeachers[0]);
      (mockRepository.save as jest.Mock).mockResolvedValue(mockTeachers[0]);

      const id = 'teacher_001';
      const updatedTeacher: UpdateUserDto = {
        gender: UserGender.FEMALE,
        firstName: '',
        lastName: '',
        dateOfBirth: new Date(),
        contact: {
          address: 'new updated address',
          phoneNumber: '+2336550977',
        },
      };
      const result = await userService.update(
        id,
        updatedTeacher,
        mockRepository as unknown as Repository<Teacher>,
      );

      expect(mockRepository.findOne).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();

      expect(result).toBe(mockTeachers[0]);
    });

    it('should throw expection if user is not found', async () => {
      (mockRepository.findOne as jest.Mock).mockResolvedValue(null);

      const id = 'teacher_001';
      const updatedTeacher: UpdateUserDto = {
        gender: UserGender.FEMALE,
        firstName: '',
        lastName: '',
        dateOfBirth: new Date(),
        contact: {
          address: 'new updated address',
          phoneNumber: '+2336550977',
        },
      };

      await expect(
        userService.update(id, updatedTeacher, mockRepository),
      ).rejects.toThrow(new NotFoundException(`User with ID ${id} not found`));
    });
  });

  describe('partialUpdate', () => {
    it('should partially update teacher details', async () => {
      const partialData = {
        gender: UserGender.FEMALE,
        firstName: '',
        lastName: '',
      };

      const updatedUser = {
        ...mockTeachers[0],
        ...partialData,
      };
      // Mock preload to return the existing user with partial updates applied
      mockRepository.preload?.mockResolvedValue(updatedUser);

      // Mock save to return the updated user
      mockRepository.save.mockResolvedValue(updatedUser);

      const id = 'teacher_001';

      const result = await userService.partialUpdate(
        id,
        partialData,
        mockRepository,
      );
      expect(mockRepository.preload).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();

      expect(result).toBe(updatedUser);
    });

    it('should throw expection if user is not found', async () => {
      const partialData = {
        gender: UserGender.FEMALE,
        firstName: '',
        lastName: '',
      };

      (mockRepository.preload as jest.Mock).mockResolvedValue(null);

      const id = 'teacher_001';

      await expect(
        userService.partialUpdate(id, partialData, mockRepository),
      ).rejects.toThrow(new NotFoundException(`User with ID ${id} not found`));
    });
  });
});
