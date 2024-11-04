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
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { mockAuths } from '@app-root/mocks/auth';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { mockParents } from '@app-root/mocks/parent';
import { mockRole } from '@app-root/mocks/role';
import { Permission, RoleType } from '@app-types/role.types';
import { JwtService } from '@nestjs/jwt';

describe('Auth Service', () => {
  let authService: AuthService;
  let childService: ChildService;
  let parentService: ParentService;
  let teacherService: TeacherService;
  let passwordService: PasswordService;
  let jwtService: JwtService;

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
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(), // Mock the signAsync method
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();
    passwordService = module.get<PasswordService>(PasswordService);
    parentService = module.get<ParentService>(ParentService);
    childService = module.get<ChildService>(ChildService);
    teacherService = module.get<TeacherService>(TeacherService);
    jwtService = module.get<JwtService>(JwtService);
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

    const mockToken = 'mockAccessToken';

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
      jest
        .spyOn(authService, 'generateToken')
        .mockResolvedValue({ accessToken: mockToken });
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
      expect(result).toEqual({ accessToken: mockToken });
    });

    it('should hash the password and create an Auth entity for a child', async () => {
      jest
        .spyOn(authService, 'generateToken')
        .mockResolvedValue({ accessToken: mockToken });
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
      expect(result).toEqual({ accessToken: mockToken });
    });

    it('should hash the password and create an Auth entity for a teacher', async () => {
      jest
        .spyOn(authService, 'generateToken')
        .mockResolvedValue({ accessToken: mockToken });
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
      expect(result).toEqual({ accessToken: mockToken });
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'john.parent@example.com',
      password: 'password123',
    };
    it('should call validate and generate token when login service is called', async () => {
      const mockToken = 'mockAccessToken';
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockAuths[0]);
      jest
        .spyOn(authService, 'generateToken')
        .mockResolvedValue({ accessToken: mockToken });

      expect(await authService.login(loginDto)).toStrictEqual({
        accessToken: mockToken,
      });
      expect(authService.validateUser).toHaveBeenCalledTimes(1);
      expect(authService.validateUser).toHaveBeenCalledWith(loginDto);
      expect(authService.generateToken).toHaveBeenCalledTimes(1);
      expect(authService.generateToken).toHaveBeenCalledWith(mockAuths[0]);
    });
  });
  describe('validateUser', () => {
    const loginDto: LoginDto = {
      email: 'john.parent@example.com',
      password: 'password123',
    };
    it('should validate an authorized user', async () => {
      mockAuthRepository.findOne = jest.fn().mockResolvedValue(mockAuths[0]);
      passwordService.comparePassword = jest.fn().mockResolvedValueOnce(true);
      const result = await authService.validateUser(loginDto);
      expect(mockAuthRepository.findOne).toHaveBeenCalled();
      expect(result).toEqual(mockAuths[0]);
    });

    it('should not validate an unauthorized user', async () => {
      mockAuthRepository.findOne = jest.fn().mockResolvedValue(null);
      await expect(authService.validateUser(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
    });

    it('should not login a user with invalid credentials', async () => {
      mockAuthRepository.findOne = jest.fn().mockResolvedValue(mockAuths[0]);
      passwordService.comparePassword = jest.fn().mockResolvedValueOnce(false);
      await expect(authService.validateUser(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
    });
  });

  describe('validateToken', () => {
    it('should valdate accessToken', async () => {
      const testPayload = {
        sub: 'mockAuth.id',
        username: 'mockAuth.email',
        userType: 'mockAuth.userType',
      };
      // Mock the jwtService's signAsync method to return a token string
      const mockToken = 'mockAccessToken';
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(testPayload);
      mockAuthRepository.findOne = jest.fn().mockResolvedValue(mockAuths[0]);

      const result = await authService.validateToken(mockToken);
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(mockToken);
      expect(result).toEqual(mockAuths[0]);
    });

    it('should throw error for an invalid token', async () => {
      const mockToken = 'mockAccessToken';
      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockRejectedValue(new Error('Invalid token'));

      await expect(authService.validateToken(mockToken)).rejects.toThrow(
        new UnauthorizedException('Invalid token'),
      );
    });
  });

  describe('generateToken', () => {
    it('should generate accessToken to login user', async () => {
      const mockAuth = mockAuths[0];
      // Mock the jwtService's signAsync method to return a token string
      const mockToken = 'mockAccessToken';
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(mockToken);

      const result = await authService.generateToken(mockAuth);

      // Verify jwtService was called with correct payload
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockAuth.id,
        username: mockAuth.email,
        userType: mockAuth.userType,
      });

      // Verify the result has the expected accessToken
      expect(result).toEqual({ accessToken: mockToken });
    });

    it('should throw an HttpException if token generation fails', async () => {
      // Mock signAsync to throw an error
      const errorMessage = 'Token error';
      jest
        .spyOn(jwtService, 'signAsync')
        .mockRejectedValue(new Error(errorMessage));

      // Use .rejects.toThrow to test async error throwing with HttpException
      await expect(authService.generateToken(mockAuths[0])).rejects.toThrow(
        new HttpException(
          'Failed to generate access token',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
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

  describe('getUserType', () => {
    it('should return the userType given the id', async () => {
      const testAuth = {
        id: 'c6614cd8-ec2b-4802-ac3e-bad94207cec3',
        email: 'john.parent@example.com',
        password: 'password123',
        userType: UserType.PARENT,
        parent: mockParents[0],
        roles: [mockRole.PARENT],
        createdAt: new Date('2021-10-12T22:45:00Z'),
        updatedAt: new Date('2021-10-12T22:45:00Z'),
      };
      mockAuthRepository.findOne = jest.fn().mockResolvedValue(testAuth);
      expect(
        await authService.getUserType('c6614cd8-ec2b-4802-ac3e-bad94207cec3'),
      ).toBe(UserType.PARENT);
    });

    it('should return error if user is not found', async () => {
      mockAuthRepository.findOne = jest.fn().mockResolvedValue(undefined);
      await expect(
        authService.getUserType('c6614cd8-ec2b-4802-ac3e-bad94207cec3'),
      ).rejects.toThrow(new Error('User not found'));
    });
  });

  describe('getUserRoles', () => {
    it('should return the roles of a user given the id', async () => {
      const testAuth = {
        id: 'c6614cd8-ec2b-4802-ac3e-bad94207cec3',
        email: 'john.parent@example.com',
        password: 'password123',
        userType: UserType.PARENT,
        parent: mockParents[0],
        roles: [mockRole.PARENT],
        createdAt: new Date('2021-10-12T22:45:00Z'),
        updatedAt: new Date('2021-10-12T22:45:00Z'),
      };
      mockAuthRepository.findOne = jest.fn().mockResolvedValue(testAuth);
      expect(
        await authService.getUserRoles('c6614cd8-ec2b-4802-ac3e-bad94207cec3'),
      ).toStrictEqual([mockRole.PARENT]);
    });

    it('should return error if user is not found', async () => {
      mockAuthRepository.findOne = jest.fn().mockResolvedValue(undefined);
      await expect(
        authService.getUserRoles('c6614cd8-ec2b-4802-ac3e-bad94207cec3'),
      ).rejects.toThrow(new Error('User or roles not found'));
    });
  });

  describe('hasRole', () => {
    it('should return true if user has required roles', async () => {
      const testAuth = {
        id: 'c6614cd8-ec2b-4802-ac3e-bad94207cec3',
        email: 'john.parent@example.com',
        password: 'password123',
        userType: UserType.PARENT,
        parent: mockParents[0],
        roles: [mockRole.PARENT],
        createdAt: new Date('2021-10-12T22:45:00Z'),
        updatedAt: new Date('2021-10-12T22:45:00Z'),
      };
      mockAuthRepository.findOne = jest.fn().mockResolvedValue(testAuth);
      expect(
        await authService.hasRole('c6614cd8-ec2b-4802-ac3e-bad94207cec3', [
          RoleType.PARENT,
        ]),
      ).toBe(true);
    });

    it('should false if user does not have all the required roles', async () => {
      mockAuthRepository.findOne = jest.fn().mockResolvedValue(undefined);
      expect(
        await authService.hasRole('c6614cd8-ec2b-4802-ac3e-bad94207cec3', [
          RoleType.CHILD,
          RoleType.PARENT,
        ]),
      ).toBe(false);
    });
  });

  describe('hasPermission', () => {
    it('should return true if user has required permisions', async () => {
      const testAuth = {
        id: 'c6614cd8-ec2b-4802-ac3e-bad94207cec3',
        email: 'john.parent@example.com',
        password: 'password123',
        userType: UserType.PARENT,
        parent: mockParents[0],
        roles: [mockRole.PARENT],
        createdAt: new Date('2021-10-12T22:45:00Z'),
        updatedAt: new Date('2021-10-12T22:45:00Z'),
      };
      mockAuthRepository.findOne = jest.fn().mockResolvedValue(testAuth);
      expect(
        await authService.hasPermission(
          'c6614cd8-ec2b-4802-ac3e-bad94207cec3',
          [Permission.ASSIGN_ROLES, Permission.VIEW_HOMEWORK],
        ),
      ).toBe(true);
    });

    it('should false if user does not have all the required permissions', async () => {
      mockAuthRepository.findOne = jest.fn().mockResolvedValue(undefined);
      expect(
        await authService.hasPermission(
          'c6614cd8-ec2b-4802-ac3e-bad94207cec3',
          [Permission.ASSIGN_ROLES, Permission.VIEW_CLASSES],
        ),
      ).toBe(false);
    });
  });
});
