import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Child, Parent, Teacher } from './entities';
import {
  ChildDetailsController,
  ParentDetailsController,
  TeacherDetailsController,
} from './controllers';
import { ParentService } from './services/parent.service';
import { ChildService } from './services/child.service';
import { TeacherService } from './services/teacher.service';
import { PasswordService } from '@app-shared/services/password-service';
import { UserService } from './services/user.service';
import { UsersController } from './controllers/user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Parent, Teacher, Child])],
  providers: [
    ParentService,
    ChildService,
    TeacherService,
    PasswordService,
    UserService,
  ],
  controllers: [
    ParentDetailsController,
    ChildDetailsController,
    TeacherDetailsController,
    UsersController,
  ],
  exports: [ParentService, TeacherService, ChildService],
})
export class UserModule {}
