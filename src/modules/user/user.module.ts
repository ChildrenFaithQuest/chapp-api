import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParentService } from './services/parent.service';
import { ChildService } from './services/child.service';
import { TeacherService } from './services/teacher.service';
import { UserService } from './services/user.service';
import { UsersController } from './controllers/user.controller';
import { Parent } from './entities/parent.entity';
import { Teacher } from './entities/teacher.entity';
import { Child } from './entities/child.entity';
import { ParentDetailsController } from './controllers/parent.controller';
import { ChildDetailsController } from './controllers/child.controller';
import { TeacherDetailsController } from './controllers/teacher.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Parent, Teacher, Child])],
  providers: [ParentService, ChildService, TeacherService, UserService],
  controllers: [
    ParentDetailsController,
    ChildDetailsController,
    TeacherDetailsController,
    UsersController,
  ],
  exports: [ParentService, TeacherService, ChildService],
})
export class UserModule {}
