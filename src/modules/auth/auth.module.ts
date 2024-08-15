import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordService } from '@app-shared/services/password-service';
import { Auth } from './entities/auth.entity';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { ParentService } from '@app-modules/user/services/parent.service';
import { ChildService } from '@app-modules/user/services/child.service';
import { TeacherService } from '@app-modules/user/services/teacher.service';
import { Child, Parent, Teacher } from '@app-modules/user';

@Module({
  imports: [TypeOrmModule.forFeature([Auth, Parent, Child, Teacher])],
  providers: [
    PasswordService,
    AuthService,
    ParentService,
    ChildService,
    TeacherService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
