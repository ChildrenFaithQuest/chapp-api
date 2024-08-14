import 'tsconfig-paths/register';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Child, Parent, Teacher } from '@app-modules/user';
import { Church } from '@app-modules/church/entities/church.entity';
import { Class } from '@app-modules/class/entities/class.entity';
import { Attendance } from '@app-modules/attendance/entities/attendance.entity';
import { Auth } from '@app-modules/auth/entities/auth.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Auth, Child, Parent, Teacher, Class, Attendance, Church], // Ensure this path is correct
  migrations: ['dist/src/migrations/*.js'], // Ensure this path is correct
  synchronize: false,
});
