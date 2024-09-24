import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager, Repository } from 'typeorm';

import { AuthService } from './auth.service';
import { Auth } from '../entities/auth.entity';
import { ChildService } from '@app-modules/user/services/child.service';
import { ParentService } from '@app-modules/user/services/parent.service';
import { TeacherService } from '@app-modules/user/services/teacher.service';
import { RegisterDto } from '../dtos/register.dto';
import { UserGender, UserType } from '@app-types/module.types';
import { PasswordService } from '@app-shared/services/password-service';
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { mockAuths } from '@app-root/mocks/auth';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ChangePasswordDto } from '../dtos/change-password.dto';

describe('Auth Service', () => {
  let authService: AuthService;
  let childService: ChildService;
  let parentService: ParentService;
  let teacherService: TeacherService;
  let passwordService: PasswordService;

  let mockAuthRepository: Repository<Auth>;
  let transactionalEntityManager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'AuthRepository',
          useValue: {
            manager: {
              transaction: jest.fn(), // Mocking the transaction method
            },
          }, // Mock repository
        },
        {
          provide: PasswordService,
          useValue: {
            hashPassword: jest.fn(),
          },
        },
        {
          provide: ParentService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: ChildService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: TeacherService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();
    passwordService = module.get<PasswordService>(PasswordService);
    parentService = module.get<ParentService>(ParentService);
    childService = module.get<ChildService>(ChildService);
    teacherService = module.get<TeacherService>(TeacherService);
    authService = module.get<AuthService>(AuthService);
    mockAuthRepository = module.get<Repository<Auth>>('AuthRepository');

    passwordService.hashPassword = jest
      .fn()
      .mockResolvedValueOnce('hashedPassword');
  });

  beforeEach(() => {
    jest.clearAllMocks(); // or jest.resetAllMocks() to reset mocks entirely
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'john.parent@example.com',
      password: 'password123',
      userType: UserType.PARENT,
      firstName: 'testFirstName',
      lastName: 'testLastName',
      gender: UserGender.FEMALE,
    };
    const createdUser = {
      id: 'auth_001',
      email: registerDto.email,
      password: 'hashedPassword',
    };

    transactionalEntityManager = {
      findOne: jest.fn().mockResolvedValueOnce(null), // No existing auth
      save: jest.fn().mockResolvedValueOnce({
        id: 'auth_001',
        email: registerDto.email,
      }),
    } as any;

    it('should throw ConflictException if email already exists', async () => {
      transactionalEntityManager.findOne = jest
        .fn()
        .mockResolvedValueOnce({ email: registerDto.email });

      mockAuthRepository.manager.transaction = jest.fn().mockImplementationOnce(
        async (callback) => callback(transactionalEntityManager), // Mock transaction callback
      );

      await expect(authService.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should hash the password and create an Auth entity for a parent', async () => {
      registerDto.userType = UserType.PARENT;
      transactionalEntityManager.create = jest.fn().mockReturnValueOnce({
        ...createdUser,
        userType: UserType.PARENT,
      });
      mockAuthRepository.manager.transaction = jest.fn().mockImplementationOnce(
        async (callback) => callback(transactionalEntityManager), // Mock transaction callback
      );

      parentService.create = jest
        .fn()
        .mockResolvedValueOnce({ id: 'parent_001' });

      const result = await authService.register(registerDto);
      expect(passwordService.hashPassword).toHaveBeenCalledWith(
        registerDto.password,
      );

      expect(transactionalEntityManager.create).toHaveBeenCalledWith(Auth, {
        email: registerDto.email,
        password: 'hashedPassword',
        userType: registerDto.userType,
      });
      expect(transactionalEntityManager.save).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        id: 'auth_001',
        email: registerDto.email,
        parent: { id: 'parent_001' },
        password: 'hashedPassword',
        userType: registerDto.userType,
      });
    });

    it('should hash the password and create an Auth entity for a child', async () => {
      const childId = 'child_001';
      registerDto.userType = UserType.CHILD;
      transactionalEntityManager.create = jest.fn().mockReturnValueOnce({
        ...createdUser,
        userType: UserType.CHILD,
      });
      mockAuthRepository.manager.transaction = jest.fn().mockImplementationOnce(
        async (callback) => callback(transactionalEntityManager), // Mock transaction callback
      );

      childService.create = jest.fn().mockResolvedValueOnce({ id: childId });

      const result = await authService.register(registerDto);
      expect(passwordService.hashPassword).toHaveBeenCalledWith(
        registerDto.password,
      );

      expect(transactionalEntityManager.create).toHaveBeenCalledWith(Auth, {
        email: registerDto.email,
        password: 'hashedPassword',
        userType: registerDto.userType,
      });
      expect(transactionalEntityManager.save).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        id: 'auth_001',
        email: registerDto.email,
        child: { id: childId },
        password: 'hashedPassword',
        userType: registerDto.userType,
      });
    });

    it('should hash the password and create an Auth entity for a teacher', async () => {
      const teacherId = 'teacher_001';
      registerDto.userType = UserType.TEACHER;

      transactionalEntityManager.create = jest.fn().mockReturnValueOnce({
        ...createdUser,
        userType: UserType.TEACHER,
      });
      mockAuthRepository.manager.transaction = jest.fn().mockImplementationOnce(
        async (callback) => callback(transactionalEntityManager), // Mock transaction callback
      );

      teacherService.create = jest
        .fn()
        .mockResolvedValueOnce({ id: teacherId });

      const result = await authService.register(registerDto);
      expect(passwordService.hashPassword).toHaveBeenCalledWith(
        registerDto.password,
      );

      expect(transactionalEntityManager.create).toHaveBeenCalledWith(Auth, {
        email: registerDto.email,
        password: 'hashedPassword',
        userType: registerDto.userType,
      });
      expect(transactionalEntityManager.save).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        id: 'auth_001',
        email: registerDto.email,
        teacher: { id: teacherId },
        password: 'hashedPassword',
        userType: registerDto.userType,
      });
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'john.parent@example.com',
      password: 'password123',
    };

    it('should login an authorized user', async () => {
      mockAuthRepository.findOne = jest.fn().mockResolvedValue(mockAuths[0]);
      passwordService.comparePassword = jest.fn().mockResolvedValueOnce(true);
      const result = await authService.login(loginDto);
      expect(mockAuthRepository.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockAuths[0]);
    });

    it('should not login an unauthorized user', async () => {
      mockAuthRepository.findOne = jest.fn().mockResolvedValue(null);
      await expect(authService.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
    });

    it('should not login a user with invalid credentials', async () => {
      mockAuthRepository.findOne = jest.fn().mockResolvedValue(mockAuths[0]);
      passwordService.comparePassword = jest.fn().mockResolvedValueOnce(false);
      await expect(authService.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
    });
  });

  describe('forgotPassword', () => {
    const forgotPasswordDto: ForgotPasswordDto = {
      email: 'john.parent@example.com',
    };
    it('should send an email when forgorPassword service is called', async () => {
      mockAuthRepository.findOne = jest.fn().mockResolvedValue(mockAuths[0]);
      const result = await authService.forgotPassword(forgotPasswordDto);
      expect(mockAuthRepository.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual('A mail has been sent to your email');
    });

    it('should send an unauthorized exception when forgorPassword service is called with invalid email', async () => {
      mockAuthRepository.findOne = jest.fn().mockResolvedValue(null);
      await expect(
        authService.forgotPassword(forgotPasswordDto),
      ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));
    });
  });

  describe('changePassword', () => {
    const changePasswordDto: ChangePasswordDto = {
      currentPassword: 'myCurrentpassword',
      newPassword: 'myNewPassword',
      confirmNewPassword: 'myNewPassword',
    };
    const id = 'test-id';
    it('should successfully change a user password', async () => {
      mockAuthRepository.findOneBy = jest.fn().mockResolvedValue(mockAuths[0]);
      passwordService.comparePassword = jest.fn().mockResolvedValueOnce(true);
      mockAuthRepository.save = jest.fn().mockResolvedValue(mockAuths[0]);
      const result = await authService.changePassword(id, changePasswordDto);
      expect(result).toEqual('Password successfully Changed');
    });

    it('should throw erorr when wrong new password is sent', async () => {
      changePasswordDto.confirmNewPassword = 'wrongNewPassword';
      mockAuthRepository.findOneBy = jest.fn().mockResolvedValue(mockAuths[0]);
      passwordService.comparePassword = jest.fn().mockResolvedValueOnce(true);
      mockAuthRepository.save = jest.fn().mockResolvedValue(mockAuths[0]);
      await expect(
        authService.changePassword(id, changePasswordDto),
      ).rejects.toThrow(
        new BadRequestException('New password and confirmation do not match'),
      );
    });

    it('should throw erorr when user is not found', async () => {
      mockAuthRepository.findOneBy = jest.fn().mockResolvedValue(null);
      passwordService.comparePassword = jest.fn().mockResolvedValueOnce(true);
      mockAuthRepository.save = jest.fn().mockResolvedValue(mockAuths[0]);
      await expect(
        authService.changePassword(id, changePasswordDto),
      ).rejects.toThrow(new BadRequestException('No user Found'));
    });

    it('should throw erorr when wrong password is entered', async () => {
      mockAuthRepository.findOneBy = jest.fn().mockResolvedValue(mockAuths[0]);
      passwordService.comparePassword = jest.fn().mockResolvedValueOnce(false);
      mockAuthRepository.save = jest.fn().mockResolvedValue(mockAuths[0]);
      await expect(
        authService.changePassword(id, changePasswordDto),
      ).rejects.toThrow(
        new BadRequestException('Current password is incorrect'),
      );
    });
  });
});
