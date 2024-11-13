import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

import { AuthService } from './auth.service';
import { Auth } from '../entities/auth.entity';
import { ChildService } from '@app-modules/user/services/child.service';
import { ParentService } from '@app-modules/user/services/parent.service';
import { TeacherService } from '@app-modules/user/services/teacher.service';
import { UserGender, UserType } from '@app-types/module.types';
import { PasswordService } from '@app-shared/services/password-service';
import {
  BadRequestException,
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
import { AppwriteUserService } from '@app-root/appwrite/src/users/appwrite-user.service';
import { SignupDto } from '../dtos/signup.dto';
import { Models } from 'node-appwrite';
import { CreateUserDto } from '@app-modules/user/dtos/create-user.dto';

describe('Auth Service', () => {
  let authService: AuthService;
  let childService: ChildService;
  let parentService: ParentService;
  let teacherService: TeacherService;
  let passwordService: PasswordService;
  let jwtService: JwtService;
  let appwriteUserService: AppwriteUserService;

  let mockAuthRepository: Repository<Auth>;

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
        {
          provide: AppwriteUserService,
          useValue: {
            registerUser: jest.fn().mockResolvedValue({
              jwtToken: 'mockToken',
              user: { $id: 'parent_001' },
              session: { $id: 'testId' },
            }),
            loginUser: jest.fn(),
            getUserType: jest.fn(),
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
    appwriteUserService = module.get<AppwriteUserService>(AppwriteUserService);

    mockAuthRepository = module.get<Repository<Auth>>('AuthRepository');

    passwordService.hashPassword = jest
      .fn()
      .mockResolvedValueOnce('hashedPassword');
  });

  beforeEach(() => {
    jest.clearAllMocks(); // or jest.resetAllMocks() to reset mocks entirely
  });

  describe('signup', () => {
    const signupDto: SignupDto = {
      email: 'john.parent@example.com',
      password: 'password123',
      userType: UserType.PARENT,
      firstName: 'testFirstName',
      lastName: 'testLastName',
      gender: UserGender.FEMALE,
    };

    const mockToken = 'mockAccessToken';

    it('should signup a parent', async () => {
      signupDto.userType = UserType.PARENT;

      jest.spyOn(appwriteUserService, 'registerUser').mockResolvedValue({
        session: { $id: 'testId' } as Models.Session,
        appwriteUser: { $id: 'parent_001' } as Models.User<Models.Preferences>,
        jwtToken: mockToken,
      });

      const { email, password, firstName, lastName, userType } = signupDto;
      const result = await authService.signup(signupDto);
      const registerDto = {
        email,
        password,
        name: `${firstName} ${lastName}`,
        userType,
      };

      const createUserDto: CreateUserDto = {
        appwriteId: 'parent_001',
        firstName: signupDto.firstName,
        lastName: signupDto.lastName,
        contact: signupDto.contact,
        gender: signupDto.gender,
        dateOfBirth: signupDto.dateOfBirth,
      };

      expect(appwriteUserService.registerUser).toHaveBeenCalledWith(
        registerDto,
      );

      expect(parentService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual({
        accessToken: mockToken,
        session: { $id: 'testId' },
      });
    });

    it('should signup a child', async () => {
      signupDto.userType = UserType.CHILD;
      const childID = 'child_001';

      jest.spyOn(appwriteUserService, 'registerUser').mockResolvedValue({
        session: { $id: 'testId' } as Models.Session,
        appwriteUser: { $id: childID } as Models.User<Models.Preferences>,
        jwtToken: mockToken,
      });

      const { email, password, firstName, lastName, userType } = signupDto;
      const result = await authService.signup(signupDto);
      const registerDto = {
        email,
        password,
        name: `${firstName} ${lastName}`,
        userType,
      };

      const createUserDto: CreateUserDto = {
        appwriteId: childID,
        firstName: signupDto.firstName,
        lastName: signupDto.lastName,
        contact: signupDto.contact,
        gender: signupDto.gender,
        dateOfBirth: signupDto.dateOfBirth,
      };

      expect(appwriteUserService.registerUser).toHaveBeenCalledWith(
        registerDto,
      );

      expect(childService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual({
        accessToken: mockToken,
        session: { $id: 'testId' },
      });
    });

    it('should signup a teacher', async () => {
      signupDto.userType = UserType.TEACHER;
      const id = 'teacher_001';

      jest.spyOn(appwriteUserService, 'registerUser').mockResolvedValue({
        session: { $id: 'testId' } as Models.Session,
        appwriteUser: { $id: id } as Models.User<Models.Preferences>,
        jwtToken: mockToken,
      });

      const { email, password, firstName, lastName, userType } = signupDto;
      const result = await authService.signup(signupDto);
      const registerDto = {
        email,
        password,
        name: `${firstName} ${lastName}`,
        userType,
      };

      const createUserDto: CreateUserDto = {
        appwriteId: id,
        firstName: signupDto.firstName,
        lastName: signupDto.lastName,
        contact: signupDto.contact,
        gender: signupDto.gender,
        dateOfBirth: signupDto.dateOfBirth,
      };

      expect(appwriteUserService.registerUser).toHaveBeenCalledWith(
        registerDto,
      );

      expect(teacherService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual({
        accessToken: mockToken,
        session: { $id: 'testId' },
      });
    });

    it('should throw an error if signup fails', async () => {
      // Mock `registerUser` to throw an error
      jest
        .spyOn(appwriteUserService, 'registerUser')
        .mockRejectedValue(new Error('Appwrite registration failed'));

      try {
        // Act
        await authService.signup(signupDto);
      } catch (error) {
        // Assert
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(
          'Failed to signup user: Appwrite registration failed',
        );
      }
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'john.parent@example.com',
      password: 'password123',
    };
    it('should login a user and return token', async () => {
      const mockToken = 'mockAccessToken';
      jest.spyOn(appwriteUserService, 'loginUser').mockResolvedValue({
        session: { $id: 'testId' } as Models.Session,
        jwtToken: mockToken,
      });

      expect(await authService.login(loginDto)).toStrictEqual({
        accessToken: mockToken,
        session: { $id: 'testId' },
      });
    });

    it('should throw an error if login fails', async () => {
      // Mock `registerUser` to throw an error
      jest
        .spyOn(appwriteUserService, 'loginUser')
        .mockRejectedValue(new Error('Appwrite registration failed'));

      try {
        // Act
        await authService.login(loginDto);
      } catch (error) {
        // Assert
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(
          'Failed to login user: Appwrite registration failed',
        );
      }
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
      jest
        .spyOn(appwriteUserService, 'getUserType')
        .mockResolvedValue(UserType.PARENT);

      expect(await authService.getUserType('testID')).toStrictEqual(
        UserType.PARENT,
      );
    });

    it('should return error if getUserType fails', async () => {
      jest
        .spyOn(appwriteUserService, 'getUserType')
        .mockRejectedValue(new Error('Appwrite getUserType failed'));
      try {
        // Act
        await authService.getUserType('testId');
      } catch (error) {
        // Assert
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe(
          'Failed to get user type: Appwrite getUserType failed',
        );
      }
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
