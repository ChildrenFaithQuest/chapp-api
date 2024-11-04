import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Optional,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository, EntityManager } from 'typeorm';
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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly passwordService: PasswordService,
    private readonly parentService: ParentService,
    private readonly childService: ChildService,
    private readonly teacherService: TeacherService,
    @Optional() private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ accessToken: string }> {
    const { email, password, userType, ...userDetails } = registerDto;
    return this.authRepository.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        // Check if the email already exists
        const existingAuth = await transactionalEntityManager.findOne(Auth, {
          where: { email: registerDto.email },
        });
        if (existingAuth) {
          throw new ConflictException('Email already in use');
        }

        // Hash the password
        const hashedPassword =
          await this.passwordService.hashPassword(password);

        // Create authentication record
        const auth = transactionalEntityManager.create(Auth, {
          email,
          password: hashedPassword,
          userType, // Assuming userType is part of RegisterDto
        });

        // Save authentication record
        await transactionalEntityManager.save(Auth, auth);

        const { firstName, lastName, contact, gender, dateOfBirth } =
          userDetails;

        // Create user-specific record based on userType
        let userSpecificRecord;
        if (userType === 'parent') {
          userSpecificRecord = await this.parentService.create(
            {
              firstName,
              lastName,
              contact,
              gender,
              dateOfBirth,
            } as CreateUserDto,
            transactionalEntityManager,
          );
          auth.parent = userSpecificRecord;
        } else if (userType === 'child') {
          userSpecificRecord = await this.childService.create(
            { firstName, lastName, gender, dateOfBirth } as CreateUserDto,
            transactionalEntityManager,
          );
          auth.child = userSpecificRecord;
        } else if (registerDto.userType === 'teacher') {
          userSpecificRecord = await this.teacherService.create(
            {
              firstName,
              lastName,
              contact,
              gender,
              dateOfBirth,
            } as CreateUserDto,
            transactionalEntityManager,
          );
          auth.teacher = userSpecificRecord;
        }

        // Save the updated authentication record with user-specific details
        await transactionalEntityManager.save(Auth, auth);

        // return auth;
        return await this.generateToken(auth);
      },
    );
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const auth = await this.validateUser(loginDto);
    return await this.generateToken(auth);
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

  async validateToken(token: string): Promise<Auth> {
    try {
      // Verify the token
      const payload = await this.jwtService.verifyAsync(token);
      // Here, you can add logic to fetch the user from the database using payload.sub (or other identifying fields)
      const auth = await this.authRepository.findOne({
        where: { id: payload.sub },
      });

      if (!auth) {
        throw new UnauthorizedException('User not found');
      }

      return auth;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async generateToken(auth: Auth): Promise<{ accessToken: string }> {
    const payload = {
      sub: auth.id, // Using auth id as the subject
      username: auth.email,
      userType: auth.userType,
    };

    try {
      // Generate the JWT
      const accessToken = await this.jwtService.signAsync(payload);
      return { accessToken };
    } catch (error) {
      // Handle error during token generation
      throw new HttpException(
        'Failed to generate access token',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
  async getUserType(userId: string): Promise<UserType> {
    const user = await this.authRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.userType;
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
