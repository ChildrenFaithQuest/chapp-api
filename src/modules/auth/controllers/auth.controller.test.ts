import { UserGender, UserType } from '@app-types/module.types';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { mockAuths } from '@app-root/mocks/auth';
import { Repository } from 'typeorm';
import { Auth } from '../entities/auth.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mock } from 'jest-mock-extended';
import { ParentService } from '@app-modules/user/services/parent.service';
import { ChildService } from '@app-modules/user/services/child.service';
import { PasswordService } from '@app-shared/services/password-service';
import { TeacherService } from '@app-modules/user/services/teacher.service';
import { UserService } from '@app-modules/user/services/user.service';
import { Parent } from '@app-modules/user/entities/parent.entity';
import { Child } from '@app-modules/user/entities/child.entity';
import { Teacher } from '@app-modules/user/entities/teacher.entity';
import { RegisterDto } from '../dtos/register.dto';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ChangePasswordDto } from '../dtos/change-password.dto';

describe('AuthController', () => {
  let mockAuthRepository: jest.Mocked<Repository<Auth>>;
  let mockParentRepository: jest.Mocked<Repository<Parent>>;
  let mockChildRepository: jest.Mocked<Repository<Child>>;

  let mockTeacherRepository: jest.Mocked<Repository<Teacher>>;

  let authController: AuthController;
  let authService: AuthService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let passwordService: PasswordService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let parentService: ParentService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userService: UserService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let childService: ChildService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let teacherService: TeacherService;

  beforeEach(async () => {
    mockAuthRepository = mock<Repository<Auth>>();
    mockParentRepository = mock<Repository<Parent>>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Auth),
          useValue: mockAuthRepository, // Mock repository
        },
        PasswordService,
        ParentService,
        {
          provide: getRepositoryToken(Parent),
          useValue: mockParentRepository, // Mock repository
        },
        UserService,
        ChildService,
        {
          provide: getRepositoryToken(Child),
          useValue: mockChildRepository, // Mock repository
        },
        TeacherService,
        {
          provide: getRepositoryToken(Teacher),
          useValue: mockTeacherRepository, // Mock repository
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    parentService = module.get<ParentService>(ParentService);
    childService = module.get<ChildService>(ChildService);
    passwordService = module.get<PasswordService>(PasswordService);
    teacherService = module.get<TeacherService>(TeacherService);
    userService = module.get<UserService>(UserService);
  });

  describe('login', () => {
    it('should successfully call the login service', async () => {
      const loginDetails = {
        email: 'john.parent@example.com',
        password: 'password123',
        userType: UserType.PARENT,
      };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockAuths[0]);
      jest
        .spyOn(authService, 'login')
        .mockResolvedValue({ accessToken: 'testToken' });

      jest
        .spyOn(authService, 'generateToken')
        .mockResolvedValue({ accessToken: 'testToken' });
      const result = await authController.login(loginDetails);
      expect(authService.login).toHaveBeenCalledWith(loginDetails);
      expect(result).toStrictEqual({
        accessToken: 'testToken',
      });
    });

    it('should successfully call the register service', async () => {
      const registerDetails: RegisterDto = {
        email: 'john.parent@example.com',
        password: 'password123',
        userType: UserType.PARENT,
        firstName: '',
        lastName: '',
        gender: UserGender.FEMALE,
      };
      jest.spyOn(authService, 'register').mockResolvedValue(mockAuths[0]);
      expect(await authController.register(registerDetails)).toBe(mockAuths[0]);
      expect(authService.register).toHaveBeenCalledWith(registerDetails);
    });

    it('should successfully call the forgot password service', async () => {
      const forgotPasswordDto: ForgotPasswordDto = {
        email: 'test@email.com',
      };
      jest.spyOn(authService, 'forgotPassword').mockResolvedValue('Success');
      expect(await authController.forgotPassword(forgotPasswordDto)).toBe(
        'Success',
      );
      expect(authService.forgotPassword).toHaveBeenCalledWith(
        forgotPasswordDto,
      );
    });

    it('should successfully call the change password service', async () => {
      const changePasswordDto: ChangePasswordDto = {
        currentPassword: 'currentPassword',
        newPassword: 'newPassword',
        confirmNewPassword: 'newPassword',
      };
      const authId = 'testId';
      jest.spyOn(authService, 'changePassword').mockResolvedValue('Success');
      expect(
        await authController.changePassword(
          { auth: { id: authId } },
          changePasswordDto,
        ),
      ).toBe('Success');
      expect(authService.changePassword).toHaveBeenCalledWith(
        authId,
        changePasswordDto,
      );
    });
  });
});
