import { Repository } from 'typeorm';
import { UserService } from '../services/user.service';
import { UserGender, UserType } from '@app-types/module.types';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockTeachers } from '@app-root/mocks/teacher';
import { mockClass } from '@app-root/mocks/class';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UsersController } from './user.controller';
import { ParentService } from '../services/parent.service';
import { TeacherService } from '../services/teacher.service';
import { ChildService } from '../services/child.service';
import { mockParents } from '@app-root/mocks/parent';
import { mockChildren } from '@app-root/mocks/child';
import { Teacher } from '../entities/teacher.entity';
import { Parent } from '../entities/parent.entity';
import { Child } from '../entities/child.entity';
import { UpdateChildDto } from '../dtos/update-child.dto';
import { mockOrg } from '@app-root/mocks/organization';
import { AuthService } from '@app-modules/auth/services/auth.service';
import { Auth } from '@app-modules/auth/entities/auth.entity';
import { mock } from 'jest-mock-extended';
import { PasswordService } from '@app-shared/services/password-service';
import { RoleService } from '@app-modules/role/services/role.service';
import { RoleGuard } from '@app-shared/guards/role.guard';
import { Reflector } from '@nestjs/core';
// import { RoleModule } from '@app-modules/role/role.module';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

// Mock for UserService
const mockUserService = () => ({
  update: jest.fn(), // Mock any methods you are using
  partialUpdate: jest.fn(),
});

const mockRoleService = {
  hasPermission: jest.fn(() => true), // Mock the method you expect to call
};

describe('UserController', () => {
  let userController: UsersController;
  let parentRepository: Repository<Parent>;
  let teacherRepository: Repository<Teacher>;
  let childRepository: Repository<Child>;
  let authRepository: jest.Mocked<Repository<Auth>>;

  let userService: UserService;
  let parentService: ParentService;
  let teacherService: TeacherService;
  let childService: ChildService;
  let authService: AuthService;

  beforeEach(async () => {
    authRepository = mock<Repository<Auth>>();
    const module: TestingModule = await Test.createTestingModule({
      // imports: [RoleModule],
      controllers: [UsersController],
      providers: [
        TeacherService,
        {
          provide: getRepositoryToken(Teacher),
          useValue: mockRepository(), // Mock repository
        },
        ParentService,
        {
          provide: getRepositoryToken(Parent),
          useValue: mockRepository(), // Mock repository
        },
        ChildService,
        {
          provide: getRepositoryToken(Child),
          useValue: mockRepository(), // Mock repository
        },
        {
          provide: UserService,
          useValue: mockUserService(), // Use the mock user service
        },
        AuthService,
        {
          provide: getRepositoryToken(Auth),
          useValue: authRepository, // Mock repository
        },
        {
          provide: PasswordService,
          useValue: {
            hashPassword: jest.fn(),
          },
        },
        {
          provide: RoleService,
          useValue: mockRoleService, // Provide a mock RoleService
        },
        RoleGuard, // Explicitly provide the RoleGuard
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(() => []), // Mock the reflector's get method
          },
        },
      ],
    }).compile();

    userController = module.get<UsersController>(UsersController);
    teacherService = module.get<TeacherService>(TeacherService);
    parentService = module.get<ParentService>(ParentService);
    childService = module.get<ChildService>(ChildService);
    authService = module.get<AuthService>(AuthService);

    teacherRepository = module.get<Repository<Teacher>>(
      getRepositoryToken(Teacher),
    );
    parentRepository = module.get<Repository<Parent>>(
      getRepositoryToken(Parent),
    );

    childRepository = module.get<Repository<Child>>(getRepositoryToken(Child));

    userService = module.get<UserService>(UserService);
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      jest.spyOn(parentService, 'findAll').mockResolvedValue(mockParents);
      jest.spyOn(teacherService, 'findAll').mockResolvedValue(mockTeachers);
      jest.spyOn(childService, 'findAll').mockResolvedValue(mockChildren);
      const allUsers = [...mockParents, ...mockTeachers, ...mockChildren];
      const result = await userController.getAll();
      expect(result).toEqual(allUsers);
    });
  });

  describe('findOne', () => {
    it('should return a child', async () => {
      jest.spyOn(authService, 'getUserType').mockResolvedValue(UserType.CHILD);
      jest.spyOn(childService, 'findOne').mockResolvedValue(mockChildren[2]);

      expect(await userController.findOne('child_003')).toBe(mockChildren[2]);
    });

    it('should return a parent', async () => {
      jest.spyOn(authService, 'getUserType').mockResolvedValue(UserType.PARENT);
      jest.spyOn(parentService, 'findOne').mockResolvedValue(mockParents[2]);

      expect(await userController.findOne('parent_003')).toBe(mockParents[2]);
    });

    it('should return a teacher', async () => {
      jest
        .spyOn(authService, 'getUserType')
        .mockResolvedValue(UserType.TEACHER);
      jest.spyOn(teacherService, 'findOne').mockResolvedValue(mockTeachers[2]);

      expect(await userController.findOne('teacher_003')).toBe(mockTeachers[2]);
    });
  });

  describe('update', () => {
    it('should update a teacher user record', async () => {
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
      jest
        .spyOn(authService, 'getUserType')
        .mockResolvedValue(UserType.TEACHER);

      const result = await userController.update(id, updateTeacherDto);

      expect(result).toEqual(updatedTeacher);

      expect(userService.update).toHaveBeenCalledWith(
        id,
        updateTeacherDto,
        teacherRepository,
      );
    });

    it('should update a parent user record', async () => {
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
      jest.spyOn(authService, 'getUserType').mockResolvedValue(UserType.PARENT);
      const result = await userController.update(
        id,
        // UserType.PARENT,
        updateParentDto,
      );

      expect(result).toEqual(updatedParent);

      expect(userService.update).toHaveBeenCalledWith(
        id,
        updateParentDto,
        parentRepository,
      );
    });

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
      jest.spyOn(authService, 'getUserType').mockResolvedValue(UserType.CHILD);

      const result = await userController.update(
        id,
        // UserType.CHILD,
        updateChildDto,
      );

      expect(result).toEqual(updatedChild);

      expect(userService.update).toHaveBeenCalledWith(
        id,
        updateChildDto,
        childRepository,
      );
    });
  });

  describe('partialUpdate', () => {
    it('should partially update a teacher record', async () => {
      const id = 'teacher_001';
      const partialUpdateTeacherDto: Partial<UpdateUserDto> = {
        gender: UserGender.MALE, // Only updating gender
      };

      const existingTeacher: Teacher = {
        id,
        gender: UserGender.FEMALE,
        firstName: 'Olivia',
        lastName: 'Williams',
        contact: {
          phoneNumber: '+1234567890',
          address: '789 Elm St, Springfield',
        },
        classes: [mockClass.FAITHFULNESS],
        organization: mockOrg.A,
        appwriteId: '616983b3b5b3d',
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
      jest
        .spyOn(authService, 'getUserType')
        .mockResolvedValue(UserType.TEACHER);

      const result = await userController.partialUpdate(
        id,
        partialUpdateTeacherDto,
      );

      expect(userService.partialUpdate).toHaveBeenCalledWith(
        id,
        partialUpdateTeacherDto,
        teacherRepository,
      );
      expect(result).toStrictEqual(updatedTeacher);
    });

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
      jest.spyOn(authService, 'getUserType').mockResolvedValue(UserType.PARENT);

      const result = await userController.partialUpdate(
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
      jest.spyOn(authService, 'getUserType').mockResolvedValue(UserType.CHILD);

      const result = await userController.partialUpdate(
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
});
