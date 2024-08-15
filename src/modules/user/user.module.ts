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

@Module({
  imports: [TypeOrmModule.forFeature([Parent, Teacher, Child])],
  providers: [ParentService, ChildService, TeacherService, PasswordService],
  controllers: [
    ParentDetailsController,
    ChildDetailsController,
    TeacherDetailsController,
  ],
  exports: [ParentService, TeacherService, ChildService],
})
export class UserModule {}
