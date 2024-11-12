import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { UserService } from './user.service';
import { UserGender } from '@app-types/module.types';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { TeacherService } from './teacher.service';
import { Teacher } from '../entities/teacher.entity';
import { mockTeacherData, mockTeachers } from '@app-root/mocks/teacher';

describe('Teacher Service', () => {
  let teacherService: TeacherService;
  let mockTeacherRepository: Partial<Repository<Teacher>>;

  let mockUserService: Partial<UserService>;

  beforeEach(async () => {
    mockUserService = {
      update: jest.fn(),
      partialUpdate: jest.fn(),
    };

    mockTeacherRepository = {
      find: jest.fn(), // Mocking the `find` method
      findOneBy: jest.fn(),
      delete: jest.fn(),
      create: jest.fn().mockReturnValue(mockTeachers[0]),
      save: jest.fn().mockReturnValue(mockTeachers[0]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeacherService,
        {
          provide: getRepositoryToken(Teacher),
          useValue: mockTeacherRepository, // Mock repository
        },
        {
          provide: UserService,
          useValue: mockUserService, // Use the mock user service
        },
      ],
    }).compile();

    teacherService = module.get<TeacherService>(TeacherService);
  });
  it('should create a teacher', async () => {
    const result = await teacherService.create(mockTeacherData);
    expect(mockTeacherRepository.create).toHaveBeenCalledTimes(1);
    expect(mockTeacherRepository.save).toHaveBeenCalledWith(result);
    expect(result).toEqual(mockTeachers[0]);
  });
  it('should findAll teachers', async () => {
    (mockTeacherRepository.find as jest.Mock).mockReturnValue(mockTeachers);
    const result = await teacherService.findAll();
    expect(mockTeacherRepository.find).toHaveBeenCalled();
    expect(result).toBe(mockTeachers);
  });

  it('should findOne teacher', async () => {
    (mockTeacherRepository.findOneBy as jest.Mock).mockReturnValue(
      mockTeachers[0],
    );
    const result = await teacherService.findOne('teacher_001');
    expect(mockTeacherRepository.findOneBy).toHaveBeenCalled();
    expect(result).toBe(mockTeachers[0]);
  });

  it('should throw expection if teacher is not found', async () => {
    (mockTeacherRepository.findOneBy as jest.Mock).mockResolvedValue(null);
    const id = 'teacher_001';
    await expect(teacherService.findOne(id)).rejects.toThrow(
      new NotFoundException(`Teacher with ID ${id} not found`),
    );
  });

  it('should update teacher details', async () => {
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
    (mockUserService.update as jest.Mock).mockResolvedValue(updatedTeacher);
    const result = await teacherService.update(id, updatedTeacher);
    expect(mockUserService.update).toHaveBeenCalled();
    expect(mockUserService.update).toHaveBeenCalledWith(
      id,
      updatedTeacher,
      mockTeacherRepository,
    );

    expect(result).toBe(updatedTeacher);
  });

  it('should partially update teacher details', async () => {
    const id = 'teacher_001';
    const updatedTeacher: Partial<UpdateUserDto> = {
      gender: UserGender.FEMALE,
      firstName: 'Robert',
    };
    (mockUserService.partialUpdate as jest.Mock).mockResolvedValue(
      updatedTeacher,
    );
    const result = await teacherService.partialUpdate(id, updatedTeacher);
    expect(mockUserService.partialUpdate).toHaveBeenCalled();
    expect(mockUserService.partialUpdate).toHaveBeenCalledWith(
      id,
      updatedTeacher,
      mockTeacherRepository,
    );
    expect(result).toBe(updatedTeacher);
  });

  it('should delete a teacher record ', async () => {
    const id = 'teacher_001';
    await teacherService.delete(id);
    expect(mockTeacherRepository.delete).toHaveBeenCalledWith(id);
  });
});
