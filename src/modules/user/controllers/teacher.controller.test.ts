import { Repository } from 'typeorm';
import { UserService } from '../services/user.service';
import { UserGender } from '@app-types/module.types';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TeacherDetailsController } from './teacher.controller';
import { TeacherService } from '../services/teacher.service';
import { mockTeachers } from '@app-root/mocks/teacher';
import { mockClass } from '@app-root/mocks/class';
import { mockChurch } from '@app-root/mocks/church';
import { Teacher } from '../entities/teacher.entity';
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

describe('TeacherController', () => {
  let teacherController: TeacherDetailsController;
  let teacherService: TeacherService;
  let parentRepository: Repository<Teacher>;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeacherDetailsController],
      providers: [
        TeacherService,
        {
          provide: getRepositoryToken(Teacher),
          useValue: mockParentRepository(), // Mock repository
        },
        {
          provide: UserService,
          useValue: mockUserService(), // Use the mock user service
        },
      ],
    }).compile();

    teacherController = module.get<TeacherDetailsController>(
      TeacherDetailsController,
    );
    teacherService = module.get<TeacherService>(TeacherService);
    parentRepository = module.get<Repository<Teacher>>(
      getRepositoryToken(Teacher),
    );
    userService = module.get<UserService>(UserService);
  });

  describe('getAll', () => {
    it('should return all teacher', async () => {
      jest.spyOn(teacherService, 'findAll').mockResolvedValue(mockTeachers);
      expect(await teacherController.getAll()).toBe(mockTeachers);
    });
  });

  describe('find', () => {
    it('should return a teacher', async () => {
      jest.spyOn(teacherService, 'findOne').mockResolvedValue(mockTeachers[2]);
      expect(await teacherController.findOne('parent_003')).toBe(
        mockTeachers[2],
      );
    });
  });

  describe('update', () => {
    it('should update a teacher record', async () => {
      const id = 'teacher_001';
      const updateTeacherDto: UpdateUserDto = {
        gender: UserGender.FEMALE,
        firstName: 'Olivia',
        lastName: 'Williams',
        contact: {
          phoneNumber: '+1234567890',
          address: '789 Elm St, Springfield',
        },
        dateOfBirth: new Date(''),
      };
      const updatedTeacher = {
        id,
        ...updateTeacherDto,
      };
      // Mock repository methods
      userService.update = jest.fn().mockResolvedValue(updatedTeacher);

      const result = await teacherController.update(id, updateTeacherDto);

      expect(result).toEqual(updatedTeacher);

      expect(userService.update).toHaveBeenCalledWith(
        id,
        updateTeacherDto,
        parentRepository,
      );
    });
  });

  describe('partialUpdate', () => {
    it('should return a parent', async () => {
      const id = 'teacher_001';
      const partialUpdateTeacherDto: Partial<UpdateUserDto> = {
        gender: UserGender.MALE, // Only updating gender
      };

      const existingTeacher = {
        id,
        gender: UserGender.FEMALE,
        firstName: 'Olivia',
        lastName: 'Williams',
        contact: {
          phoneNumber: '+1234567890',
          address: '789 Elm St, Springfield',
        },
        classes: [mockClass.FAITHFULNESS],
        church: mockChurch.A,
        createdAt: new Date('2021-10-12T22:45:00Z'),
        updatedAt: new Date('2021-10-12T22:45:00Z'),
      };

      const updatedTeacher = {
        ...existingTeacher, // All fields from the existing parent
        gender: UserGender.MALE, // Only gender is updated
      };
      userService.partialUpdate = jest
        .fn()
        .mockImplementation(() => updatedTeacher);

      const result = await teacherController.partialUpdate(
        id,
        partialUpdateTeacherDto,
      );

      expect(userService.partialUpdate).toHaveBeenCalledWith(
        id,
        partialUpdateTeacherDto,
        parentRepository,
      );
      expect(result).toStrictEqual(updatedTeacher);
    });
  });

  describe('delete', () => {
    it('should delete a teacher', async () => {
      const id = 'teacher_001';
      await teacherController.delete(id);
      expect(parentRepository.delete).toHaveBeenCalledWith(id);
    });
  });
});
