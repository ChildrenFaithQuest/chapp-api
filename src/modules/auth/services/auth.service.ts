import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Optional,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from '../entities/auth.entity';
import { PasswordService } from '@app-shared/services/password-service';
import { ParentService } from '@app-modules/user/services/parent.service';
import { ChildService } from '@app-modules/user/services/child.service';
import { TeacherService } from '@app-modules/user/services/teacher.service';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import { CreateUserDto } from '@app-modules/user/dtos/create-user.dto';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { UserType } from '@app-types/module.types';
import { Role } from '@app-modules/role/entities/role.entity';
import { Permission, RoleType } from '@app-types/role.types';
import { AppwriteAuthService } from '@app-root/appwrite/src/services/users/appwrite-auth.service';
import { Models } from 'node-appwrite';
import { SignupDto } from '../dtos/signup.dto';
import { AppwriteUserService } from '@app-root/appwrite/src/services/users/appwrite-user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly passwordService: PasswordService,
    private readonly parentService: ParentService,
    private readonly childService: ChildService,
    private readonly teacherService: TeacherService,
    @Optional() private readonly appwriteAuthService: AppwriteAuthService,
    @Optional() private readonly appwriteUserService: AppwriteUserService,
  ) {}

  async signup(
    signupDto: SignupDto,
  ): Promise<{ accessToken: string; session: Models.Session }> {
    try {
      const { email, password, userType, contact, ...userDetails } = signupDto;
      const name = `${userDetails.firstName} ${userDetails.lastName}`;
      const registerDto: RegisterDto = { email, password, userType, name };
      const { appwriteUser, jwtToken, session } =
        await this.appwriteAuthService.registerUser(registerDto);
      const { firstName, lastName, gender, dateOfBirth } = userDetails;
      const appwriteId = appwriteUser.$id;
      const createUserDto: CreateUserDto = {
        appwriteId,
        firstName,
        lastName,
        gender,
        dateOfBirth,
      };

      if (userType === UserType.PARENT) {
        await this.parentService.create({ ...createUserDto, contact });
      } else if (userType === UserType.CHILD) {
        await this.childService.create(createUserDto);
      } else if (registerDto.userType === UserType.TEACHER) {
        await this.teacherService.create({ ...createUserDto, contact });
      }
      return { accessToken: jwtToken, session };
    } catch (error) {
      throw new Error(`Failed to signup user: ${error.message}`);
    }
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; session: Models.Session }> {
    try {
      const { session, jwtToken } =
        await this.appwriteAuthService.loginUser(loginDto);
      return { accessToken: jwtToken, session };
    } catch (error) {
      throw new Error(`Failed to login user: ${error.message}`);
    }
  }

  async validateToken(token: string): Promise<Models.User<Models.Preferences>> {
    try {
      return await this.appwriteAuthService.validateToken(token);
    } catch (error) {
      throw new Error(`Failed to validate token: ${error.message}`);
    }
  }

  async validateUser(loginDto: LoginDto): Promise<Auth> {
    const auth = await this.authRepository.findOne({
      where: { email: loginDto.email },
    });
    if (auth) {
      const isValidCredentials = await this.passwordService.comparePassword(
        loginDto.password,
        auth.password,
      );
      if (isValidCredentials) {
        return auth;
      }
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<string> {
    const auth = await this.authRepository.findOne({
      where: { email: forgotPasswordDto.email },
    });
    if (!auth) {
      throw new UnauthorizedException('Invalid credentials');
    }
    //TODO Email service to send mail to user
    return 'A mail has been sent to your email';
  }

  async changePassword(
    authId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<string> {
    const { currentPassword, newPassword, confirmNewPassword } =
      changePasswordDto;

    // Verify that current password is correct
    const auth = await this.authRepository.findOneBy({ id: authId });
    if (auth) {
      const passwordMatches = await this.passwordService.comparePassword(
        currentPassword,
        auth.password,
      );

      if (!passwordMatches) {
        throw new BadRequestException('Current password is incorrect');
      }

      // Ensure newPassword matches confirmNewPassword
      if (newPassword !== confirmNewPassword) {
        throw new BadRequestException(
          'New password and confirmation do not match',
        );
      }

      // Update password
      auth.password = await this.passwordService.hashPassword(newPassword);
      await this.authRepository.save(auth);
      return 'Password successfully Changed';
    }
    throw new BadRequestException('No user Found');
  }

  /**
   * Retrieves the userType for the given user by their ID.
   */
  async getUserType(userId: string): Promise<UserType | null> {
    try {
      const userType = await this.appwriteUserService.getUserType(userId);
      return userType;
    } catch (error) {
      throw new Error(`Failed to get user type: ${error.message}`);
    }
  }

  async getUserRoles(userId: string): Promise<Role[]> {
    const user = await this.authRepository.findOne({
      where: { id: userId },
      relations: ['roles'], // Include roles in the query
    });

    if (!user || !user.roles) {
      throw new Error('User or roles not found');
    }

    return user.roles;
  }

  async hasRole(userId: string, requiredRoles: RoleType[]): Promise<boolean> {
    const user = await this.authRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user || !user.roles) {
      return false;
    }

    // Check if the user has any of the required roles
    return user.roles.some((role) => requiredRoles.includes(role.name));
  }

  async hasPermission(
    userId: string,
    requiredPermissions: Permission[],
  ): Promise<boolean> {
    const user = await this.authRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user || !user.roles) {
      return false;
    }

    // Check if any of the user's roles have the required permissions
    return user.roles.some((role) =>
      role.permissions?.some((permission) =>
        requiredPermissions.includes(permission),
      ),
    );
  }
}
