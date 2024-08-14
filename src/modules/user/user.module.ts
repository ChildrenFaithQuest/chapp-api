import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
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

@Module({
  imports: [TypeOrmModule.forFeature([User, Parent, Teacher, Child])],
  providers: [ParentService, ChildService, TeacherService, PasswordService],
  controllers: [
    ParentDetailsController,
    ChildDetailsController,
    TeacherDetailsController,
  ],
})
export class UserModule {}
