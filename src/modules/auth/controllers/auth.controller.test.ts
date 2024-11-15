import { UserGender, UserType } from '@app-types/module.types';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
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
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { SignupDto } from '../dtos/signup.dto';
import { LoginDto } from '../dtos/login.dto';

describe('AuthController', () => {
  let mockAuthRepository: jest.Mocked<Repository<Auth>>;
  let mockParentRepository: jest.Mocked<Repository<Parent>>;
  let mockChildRepository: jest.Mocked<Repository<Child>>;

  let mockTeacherRepository: jest.Mocked<Repository<Teacher>>;

  let authController: AuthController;
  let authService: AuthService;

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
  });

  describe('Auth Controller', () => {
    it('should successfully call the login service', async () => {
      const loginDetails: LoginDto = {
        email: 'john.parent@example.com',
        password: 'password123',
      };

      jest
        .spyOn(authService, 'login')
        .mockResolvedValue({ accessToken: 'testToken', session: {} as any });

      const result = await authController.login(loginDetails);
      expect(authService.login).toHaveBeenCalledWith(loginDetails);
      expect(result).toStrictEqual({
        accessToken: 'testToken',
        session: {},
      });
    });

    it('should successfully call the signup service', async () => {
      const signupDto: SignupDto = {
        email: 'john.parent@example.com',
        password: 'password123',
        userType: UserType.PARENT,
        firstName: '',
        lastName: '',
        gender: UserGender.FEMALE,
      };
      jest
        .spyOn(authService, 'signup')
        .mockResolvedValue({ accessToken: 'testToken', session: {} as any });
      expect(await authController.signup(signupDto)).toStrictEqual({
        accessToken: 'testToken',
        session: {},
      });
      expect(authService.signup).toHaveBeenCalledWith(signupDto);
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
