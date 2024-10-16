import 'tsconfig-paths/register';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Class } from '@app-modules/class/entities/class.entity';
import { Attendance } from '@app-modules/attendance/entities/attendance.entity';
import { Auth } from '@app-modules/auth/entities/auth.entity';
import { Child } from '@app-modules/user/entities/child.entity';
import { Parent } from '@app-modules/user/entities/parent.entity';
import { Teacher } from '@app-modules/user/entities/teacher.entity';
import { Organization } from '@app-modules/organization/entities/organization.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Auth, Child, Parent, Teacher, Class, Attendance, Organization], // Ensure this path is correct
  migrations:
    process.env.NODE_ENV === 'test'
      ? ['src/migrations/*.ts']
      : ['dist/src/migrations/*.js'], // Ensure this path is correct
  synchronize: false,
});
