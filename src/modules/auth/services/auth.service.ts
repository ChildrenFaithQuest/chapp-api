import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Auth } from '../entities/auth.entity';
import { PasswordService } from '@app-shared/services/password-service';
import { ParentService } from '@app-modules/user/services/parent.service';
import { ChildService } from '@app-modules/user/services/child.service';
import { TeacherService } from '@app-modules/user/services/teacher.service';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import { CreateUserDto } from '@app-modules/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepository: Repository<Auth>,
    private readonly passwordService: PasswordService,
    private readonly parentService: ParentService,
    private readonly childService: ChildService,
    private readonly teacherService: TeacherService,
  ) {}

  async register(registerDto: RegisterDto): Promise<Auth> {
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

        return auth;
      },
    );
  }

  async login(loginDto: LoginDto): Promise<Auth> {
    const auth = await this.authRepository.findOne({
      where: { email: loginDto.email },
    });
    if (
      !auth ||
      !(await this.passwordService.comparePassword(
        loginDto.password,
        auth.password,
      ))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return auth;
  }
}
